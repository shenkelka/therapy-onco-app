import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout";
import TherapyForm from "@/components/therapy-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Calendar, Award } from "lucide-react";
import { Link } from "wouter";

export default function TherapyDiary() {
  const [isFormOpen, setIsFormOpen] = useState(false);

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
      radiation: 'Лучевая терапия'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Layout currentPage="therapy">
      <div className="px-6 pt-12 pb-6">
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
        </div>

        {/* Recommendations */}
        {recommendations && (
          <Card className="bg-soft-mint rounded-2xl p-6 shadow-soft border-0 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Рекомендации</h3>
            </div>
            
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

      <main className="px-6 pb-24">
        {/* Entries List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Загрузка записей...</div>
            </div>
          ) : !entries || entries.length === 0 ? (
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
            entries.map((entry: any) => (
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
                  <div className="text-2xl">
                    {entry.mood || '😊'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Самочувствие:</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < entry.wellbeingSeverity ? "bg-yellow-400" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({entry.wellbeingSeverity}/5)</span>
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
                      <p className="text-sm text-gray-600">{entry.physicalActivity}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </Layout>
  );
}
