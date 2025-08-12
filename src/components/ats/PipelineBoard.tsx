import { useMemo, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Application } from "@/types/ats";
import { getApplicantById } from "@/lib/ats-mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, CalendarClock } from "lucide-react";
import ScoreChips from "@/components/ats/ScoreChips";
import { format } from "date-fns";

export type PipelineColumnId = "applied" | "interview_scheduled" | "offered" | "accepted" | "contracted";

const COLUMN_META: Record<PipelineColumnId, { title: string; statuses: Application["status"][] }> = {
  applied: { title: "Applied", statuses: ["pending"] },
  interview_scheduled: { title: "Interview Scheduled", statuses: ["interview_scheduled"] },
  offered: { title: "Offer/Invite", statuses: ["offered"] },
  accepted: { title: "Onboarding", statuses: ["accepted"] },
  contracted: { title: "Assigned to Project", statuses: ["contracted"] },
};

interface PipelineBoardProps {
  applications: Application[];
  onApplicationSelect: (id: string) => void;
  onOpenMessaging?: (applicationId: string, applicantName: string, composeInterview?: boolean) => void;
  onScheduleInterview?: (applicationId: string, applicantName: string) => void;
}

export default function PipelineBoard({ applications, onApplicationSelect, onOpenMessaging, onScheduleInterview }: PipelineBoardProps) {
  const [items, setItems] = useState<Application[]>(applications);

  useEffect(() => setItems(applications), [applications]);

  const columns = useMemo(() => {
    const mapping: Record<PipelineColumnId, Application[]> = {
      applied: [], interview_scheduled: [], offered: [], accepted: [], contracted: []
    };
    for (const app of items) {
      const col = (Object.keys(COLUMN_META) as PipelineColumnId[]).find((k) => COLUMN_META[k].statuses.includes(app.status));
      mapping[col ?? "applied"].push(app);
    }
    return mapping;
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const source = result.source;
    const dest = result.destination;
    const sourceCol = source.droppableId as PipelineColumnId;
    const destCol = dest.droppableId as PipelineColumnId;

    if (sourceCol === destCol && source.index === dest.index) return;

    const flat = [...items];
    const moved = flat.find((_, idx) => idx === indexFromColumns(sourceCol, source.index, columns));
    if (!moved) return;

    // Update status based on dest column
    const destStatus = COLUMN_META[destCol].statuses[0];
    if (destCol === "contracted" && moved.status !== "contracted") {
      const ok = window.confirm("Move to 'Assigned to Project'? This will mark the application as contracted.");
      if (!ok) return;
    }

    const updated = flat.map((a) => (a.id === moved.id ? { ...a, status: destStatus } : a));
    setItems(updated);
  };

  return (
    <div className="h-full overflow-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-2 sm:gap-3 min-w-[550px] px-2 sm:px-3 py-3">
          {(Object.keys(COLUMN_META) as PipelineColumnId[]).map((colId) => (
            <Droppable droppableId={colId} key={colId}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 min-w-[100px] sm:min-w-[130px]">
                  <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-2 py-2">
                    <div className="text-xs sm:text-sm font-medium truncate">{COLUMN_META[colId].title} ({columns[colId].length})</div>
                  </div>
                  <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3">
                    {columns[colId].map((app, idx) => {
                      const applicant = getApplicantById(app.applicantId);
                      if (!applicant) return null;
                      return (
                        <Draggable draggableId={app.id} index={idx} key={app.id}>
                          {(drag) => (
                            <Card ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps} className="p-2 sm:p-3 bg-card/70 backdrop-blur border-border/60 hover-scale cursor-pointer" onClick={() => onApplicationSelect(app.id)}>
                              <div className="flex items-center gap-2 sm:gap-3">
                                {applicant.profilePictureUrl && (
                                  <img src={applicant.profilePictureUrl} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"/>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-xs sm:text-sm truncate">{applicant.firstName} {applicant.lastName}</div>
                                  <div className="text-xs text-muted-foreground truncate">{applicant.location.city}, {applicant.location.country}</div>
                                </div>
                              </div>
                              <div className="mt-2">
                                <ScoreChips ai={app.aiScore} task={applicant.averageTaskScore ?? null} interview={undefined} />
                              </div>
                              <div className="flex items-center justify-between mt-2 sm:mt-3 text-xs text-muted-foreground">
                                <span className="hidden sm:inline">Applied {format(new Date(app.submittedAt), 'MMM d')}</span>
                                <span className="sm:hidden text-xs">{format(new Date(app.submittedAt), 'M/d')}</span>
                                <div className="flex gap-1">
                                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onOpenMessaging?.(app.id, `${applicant.firstName} ${applicant.lastName}`); }} className="h-6 px-1 sm:h-7 sm:px-2">
                                    <MessageSquare className="h-3 w-3"/>
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onScheduleInterview?.(app.id, `${applicant.firstName} ${applicant.lastName}`); }} className="h-6 px-1 sm:h-7 sm:px-2">
                                    <CalendarClock className="h-3 w-3"/>
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

function indexFromColumns(col: PipelineColumnId, idx: number, columns: Record<PipelineColumnId, Application[]>) {
  let offset = 0;
  for (const key of Object.keys(columns) as PipelineColumnId[]) {
    if (key === col) return offset + idx;
    offset += columns[key].length;
  }
  return idx;
}
