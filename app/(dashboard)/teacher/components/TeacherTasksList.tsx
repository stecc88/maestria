"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  PlayCircle,
  Trophy,
  ClipboardList
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface TeacherTasksListProps {
  initialTasks: any[];
}

export default function TeacherTasksList({ initialTasks }: TeacherTasksListProps) {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = initialTasks.filter(task => {
    const matchesStatus = filter === "all" || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.students.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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

      <div className="grid gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card key={task.id} className="border-none shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-gray-100">
                      <AvatarImage src={task.students.profiles.avatar_url} />
                      <AvatarFallback className="bg-primary/5 text-primary font-bold">
                        {task.students.profiles.full_name.split(' ').map((n:any) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg">
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                           <User className="h-3.5 w-3.5" />
                           <span className="font-medium">{task.students.profiles.full_name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                           <Calendar className="h-3.5 w-3.5" />
                           {format(new Date(task.created_at), "d MMMM", { locale: it })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                    {task.status === 'completed' && task.ai_score !== undefined && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl text-amber-700 font-bold border border-amber-100">
                         <Trophy className="h-4 w-4" />
                         <span>{task.ai_score}/100</span>
                      </div>
                    )}
                    {getStatusBadge(task.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
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
