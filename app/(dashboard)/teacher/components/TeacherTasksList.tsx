"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  PlayCircle,
  ClipboardList,
  RefreshCw,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils/date";
import { DeleteTaskButton } from "./DeleteTaskButton";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface TeacherTasksListProps {
  initialTasks: any[];
}

export default function TeacherTasksList({ initialTasks }: TeacherTasksListProps) {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTasks = initialTasks.filter(task => {
    const matchesStatus = filter === "all" || task.status === filter;
    const studentName = task.students?.profiles?.full_name || "";
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const generateSimilarTask = async (task: any) => {
    setIsGenerating(task.id);
    try {
      // 1. Generate content via API
      const genResponse = await fetch("/api/generate-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: task.student_id,
          writingId: task.writing_id, // We might need this if we want it linked to same writing
          exerciseType: task.exercise_type,
          errorCategories: task.corrections?.error_categories || {},
          studentLevel: task.students?.target_level || "B1"
        }),
      });

      const genData = await genResponse.json();
      if (!genResponse.ok) throw new Error(genData.error || "Errore nella generazione");

      // 2. Create the task via API (using send-task or manual insert)
      const sendResponse = await fetch("/api/send-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: task.student_id,
          teacherId: task.teacher_id,
          correctionId: task.correction_id,
          title: `Ripasso: ${genData.title}`,
          theoryExplanation: genData.theory_explanation,
          exerciseInstructions: genData.exercise_instructions,
          exerciseType: task.exercise_type,
          exerciseContent: genData.exercise_content
        }),
      });

      if (!sendResponse.ok) throw new Error("Errore nell'invio del compito");

      toast.success("Nuovo compito generato e inviato!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGenerating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-none flex gap-1 items-center px-3 py-1">
          <CheckCircle2 className="h-3 w-3" /> Completato
        </Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-700 border-none flex gap-1 items-center px-3 py-1">
          <PlayCircle className="h-3 w-3" /> In corso
        </Badge>;
      case 'started':
        return <Badge className="bg-amber-100 text-amber-700 border-none flex gap-1 items-center px-3 py-1">
          <Clock className="h-3 w-3" /> Avviato
        </Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-none flex gap-1 items-center px-3 py-1">
          <Calendar className="h-3 w-3" /> In sospeso
        </Badge>;
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 70) return "bg-green-500 text-white";
    if (score >= 50) return "bg-amber-500 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100 w-full md:w-auto overflow-x-auto">
          {["all", "pending", "in_progress", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                filter === f ? "bg-primary text-white shadow-md" : "text-gray-500 hover:text-primary hover:bg-primary/5"
              }`}
            >
              {f === "all" ? "Tutti" : f === "pending" ? "In sospeso" : f === "in_progress" ? "In corso" : "Completati"}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Cerca per titolo o studente..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const submission = Array.isArray(task.task_submissions) ? task.task_submissions[0] : task.task_submissions;
            const score = submission?.ai_score;
            const isCompleted = task.status === 'completed';
            const student = task.students;
            const profile = student?.profiles;

            return (
              <Card key={task.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-stretch">
                    {/* Left: Info */}
                    <div className="p-6 flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-gray-100">
                            <AvatarImage src={profile?.avatar_url} />
                            <AvatarFallback className="bg-primary/5 text-primary font-bold">
                              {profile?.full_name?.split(' ').map((n:any) => n[0]).join('') || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg leading-tight">
                              {task.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                               <span className="flex items-center gap-1"><User className="h-3 w-3" /> {profile?.full_name}</span>
                               <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {mounted ? formatDate(task.created_at, "d MMM yyyy") : "..."}</span>
                            </div>
                          </div>
                        </div>
                        <div className="md:hidden">
                           {getStatusBadge(task.status)}
                        </div>
                      </div>

                      {isCompleted && submission && (
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Risultato esercizio</span>
                              <Badge className={cn("rounded-lg px-2 py-0.5 font-black text-[11px]", getScoreBadgeColor(score))}>
                                 {score}/100
                              </Badge>
                           </div>
                           <div className="max-h-24 overflow-y-auto pr-2 scrollbar-hide">
                              <p className="text-xs text-gray-600 leading-relaxed">
                                 {submission.ai_feedback}
                              </p>
                           </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="bg-gray-50/50 p-6 md:w-64 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-center gap-3">
                      <div className="hidden md:flex justify-end mb-2">
                        {getStatusBadge(task.status)}
                      </div>

                      {isCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full rounded-xl border-primary/20 text-primary font-bold gap-2 hover:bg-primary/5 h-10"
                          onClick={() => generateSimilarTask(task)}
                          disabled={isGenerating === task.id}
                        >
                          <RefreshCw className={cn("h-4 w-4", isGenerating === task.id && "animate-spin")} />
                          Genera compito simile
                        </Button>
                      )}

                      <Link href={`/teacher/tasks/${task.id}`}>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full rounded-xl font-bold gap-2 h-10"
                        >
                          Vedi dettaglio <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>

                      <DeleteTaskButton
                        taskId={task.id}
                        taskTitle={task.title}
                        variant="ghost"
                        size="sm"
                        className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 h-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="border-dashed border-2 bg-transparent py-20">
            <CardContent className="text-center">
              <ClipboardList className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">Nessun compito trovato con questi criteri.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
