import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout";
import TherapyForm from "@/components/therapy-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Calendar, Award, Edit, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";

export default function TherapyDiary() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterTreatment, setFilterTreatment] = useState("");
  const [editingEntry, setEditingEntry] = useState<any>(null);

  const { data: entries, isLoading } = useQuery({
    queryKey: ["/api/therapy-entries"],
  });

  const { data: recommendations } = useQuery({
    queryKey: ["/api/recommendations"],
    enabled: entries && entries.length > 0,
    select: (data) => data,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTreatmentTypeLabel = (type: string) => {
    const labels = {
      chemotherapy: 'Химиотерапия',
      targeted: 'Таргетная терапия',
      immunotherapy: 'Иммунотерапия',
      hormonal: 'Гормональная терапия',
      radiation: 'Лучевая терапия'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getWellbeingColors = (severity: number) => {
    if (severity >= 5) {
      return {
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        border: "border-green-100",
        dots: "bg-gradient-to-r from-green-400 to-emerald-400",
        text: "text-green-600"
      };
    } else if (severity >= 3) {
      return {
        bg: "bg-gradient-to-r from-yellow-50 to-orange-50",
        border: "border-yellow-100",
        dots: "bg-gradient-to-r from-yellow-400 to-orange-400",
        text: "text-yellow-600"
      };
    } else {
      return {
        bg: "bg-gradient-to-r from-red-50 to-pink-50",
        border: "border-red-100",
        dots: "bg-gradient-to-r from-red-400 to-pink-400",
        text: "text-red-600"
      };
    }
  };

  const getWellbeingText = (severity: number) => {
    const texts = {
      1: "Очень плохо",
      2: "Плохо", 
      3: "Нормально",
      4: "Хорошо",
      5: "Очень хорошо",
      6: "Отлично"
    };
    return texts[severity as keyof typeof texts] || "Не указано";
  };

  const filteredEntries = entries?.filter((entry: any) => {
    const matchesDate = !filterDate || entry.date.includes(filterDate);
    const matchesTreatment = !filterTreatment || filterTreatment === "all" || entry.treatmentType === filterTreatment;
    return matchesDate && matchesTreatment;
  });

  return (
    <Layout currentPage="therapy">
      <div className="px-6 lg:px-8 xl:px-12 pt-6 lg:pt-8 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="w-10 h-10 bg-white rounded-xl shadow-soft">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Дневник терапии</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10 bg-white rounded-xl shadow-soft">
                <Plus className="w-5 h-5 text-gray-600" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto p-0 border-0">
              <TherapyForm onSuccess={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>

          {/* Edit Entry Dialog */}
          <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
            <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto p-0 border-0">
              <TherapyForm 
                entry={editingEntry} 
                onSuccess={() => setEditingEntry(null)} 
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Toggle - Hidden */}
        <div className="mb-6 hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-white rounded-xl shadow-soft px-3 py-2 text-gray-600 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
          </Button>
          
          {isFilterOpen && (
            <Card className="bg-white rounded-2xl p-4 shadow-soft border-0 mt-3">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    type="date"
                    placeholder="Фильтр по дате"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <Select value={filterTreatment} onValueChange={setFilterTreatment}>
                    <SelectTrigger className="border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <SelectValue placeholder="Вид терапии" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все виды</SelectItem>
                      <SelectItem value="chemotherapy">Химиотерапия</SelectItem>
                      <SelectItem value="targeted">Таргетная</SelectItem>
                      <SelectItem value="immunotherapy">Иммунотерапия</SelectItem>
                      <SelectItem value="hormonal">Гормональная</SelectItem>
                      <SelectItem value="radiation">Лучевая</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Recommendations */}
        {recommendations && (
          <Card className="bg-soft-mint rounded-2xl p-6 shadow-soft border-0 mb-6">
            
            {recommendations.supportMessage && (
              <div className="bg-white p-4 rounded-xl border-l-4 border-emerald-400 mb-4">
                <p className="text-sm text-gray-700">💚 {recommendations.supportMessage}</p>
              </div>
            )}

            {recommendations.nutrition && recommendations.nutrition.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">🥗 Питание</h4>
                <div className="space-y-1">
                  {recommendations.nutrition.map((tip: string, index: number) => (
                    <p key={index} className="text-sm text-gray-600">• {tip}</p>
                  ))}
                </div>
              </div>
            )}

            {recommendations.activity && recommendations.activity.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">🏃‍♀️ Активность</h4>
                <div className="space-y-1">
                  {recommendations.activity.map((tip: string, index: number) => (
                    <p key={index} className="text-sm text-gray-600">• {tip}</p>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      <main className="px-6 lg:px-8 xl:px-12 pb-24 lg:pb-28 xl:pb-32">
        {/* Add Entry Button - Prominent */}
        <div className="mb-6">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Добавить запись в дневник</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto p-0 border-0">
              <TherapyForm onSuccess={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Entries List */}
        <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 xl:grid-cols-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Загрузка записей...</div>
            </div>
          ) : !filteredEntries || filteredEntries.length === 0 ? (
            <Card className="bg-white rounded-2xl p-8 shadow-soft border-0 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Пока нет записей</h3>
              <p className="text-sm text-gray-600 mb-4">
                Начните вести дневник терапии, чтобы получать персональные рекомендации
              </p>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Создать первую запись
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto p-0 border-0">
                  <TherapyForm onSuccess={() => setIsFormOpen(false)} />
                </DialogContent>
              </Dialog>
            </Card>
          ) : (
            filteredEntries.map((entry: any) => {
              const wellbeingColors = getWellbeingColors(entry.wellbeingSeverity);
              return (
              <Card key={entry.id} className="bg-white rounded-2xl p-6 shadow-soft border-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {formatDate(entry.date)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getTreatmentTypeLabel(entry.treatmentType)} • Цикл {entry.cycle}, День {entry.cycleDay}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl">
                      {entry.mood || '😊'}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-8 h-8 hover:bg-gray-100"
                      onClick={() => setEditingEntry(entry)}
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Wellbeing with scale and color */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Самочувствие</span>
                      <span className={`text-sm font-semibold ${
                        entry.wellbeingSeverity >= 5 ? 'text-green-600' :
                        entry.wellbeingSeverity >= 3 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {getWellbeingText(entry.wellbeingSeverity)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          entry.wellbeingSeverity >= 5 ? 'bg-green-500' :
                          entry.wellbeingSeverity >= 3 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(entry.wellbeingSeverity / 6) * 100}%` }}
                      />
                    </div>
                  </div>

                  {entry.medications && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Препараты:</span>
                      <p className="text-sm text-gray-600">{entry.medications}</p>
                    </div>
                  )}

                  {entry.sideEffects && entry.sideEffects.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Побочные эффекты:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {entry.sideEffects.map((effect: string, index: number) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.physicalActivity && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Физическая активность:</span>
                      <p className="text-sm text-gray-600">
                        {entry.physicalActivity === 'none' ? 'Нет' : 
                         entry.physicalActivity === 'moderate' ? 'Умеренная' : 
                         entry.physicalActivity === 'high' ? 'Высокая' : entry.physicalActivity}
                        {entry.physicalActivityType && ` (${
                          entry.physicalActivityType === 'walking' ? 'прогулка' :
                          entry.physicalActivityType === 'running' ? 'бег' :
                          entry.physicalActivityType === 'cycling' ? 'велосипед' :
                          entry.physicalActivityType === 'gym' ? 'спортзал' :
                          entry.physicalActivityType === 'swimming' ? 'плавание' :
                          entry.physicalActivityType
                        })`}
                      </p>
                    </div>
                  )}

                  {entry.comments && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Комментарий:</span>
                      <p className="text-sm text-gray-600">{entry.comments}</p>
                    </div>
                  )}

                  {entry.reminder && (
                    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                      <span className="text-sm font-medium text-blue-800">Напоминание:</span>
                      <p className="text-sm text-blue-700">{entry.reminder}</p>
                    </div>
                  )}
                </div>
              </Card>
              );
            })
          )}
        </div>
      </main>
    </Layout>
  );
}
