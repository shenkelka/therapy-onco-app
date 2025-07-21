import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout";
import MoodSelector from "@/components/mood-selector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Utensils, Activity } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: recentEntries } = useQuery({
    queryKey: ["/api/therapy-entries"],
    select: (data) => data?.slice(0, 2), // Get 2 most recent entries
  });

  const { data: helpRequests } = useQuery({
    queryKey: ["/api/help-requests"],
    select: (data) => data?.slice(0, 2), // Get first 2 requests
  });

  return (
    <Layout>
      <div className="px-6 pt-12 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" className="w-10 h-10 bg-white rounded-xl shadow-soft">
            <div className="w-5 h-5 flex flex-col space-y-1">
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
            </div>
          </Button>
          <Button variant="ghost" size="icon" className="w-10 h-10 bg-white rounded-xl shadow-soft">
            <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
          </Button>
        </div>

        {/* Daily Mood Check */}
        <Card className="bg-white rounded-2xl p-6 shadow-soft mb-6 border-0">
          <div className="text-sm text-warm-gray mb-2">Ежедневная рефлексия</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Привет, {user?.name || "Мария"} 👋<br />
            Как ваше самочувствие сегодня?
          </h2>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-warm-gray">Ваше настроение</div>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          <MoodSelector />
        </Card>
      </div>

      {/* Main Content */}
      <main className="px-6 pb-24">
        {/* Therapy Diary Section */}
        <Link href="/therapy">
          <Card className="bg-soft-mint rounded-2xl p-6 mb-6 shadow-soft border-0 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Дневник терапии</h3>
                <p className="text-sm text-gray-600">Отслеживайте самочувствие и получайте рекомендации</p>
              </div>
              <Button variant="ghost" size="icon" className="w-10 h-10 bg-white rounded-xl shadow-soft hover:scale-105 transition-transform">
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Recent Entries Preview */}
            {recentEntries && recentEntries.length > 0 && (
              <div className="bg-white rounded-xl p-4 mb-4 space-y-3">
                <div className="text-sm font-medium text-gray-800 mb-3">Последние записи</div>
                {recentEntries.map((entry: any, index: number) => (
                  <div key={entry.id} className={`${index > 0 ? 'pt-3 border-t border-gray-100' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800">
                        {new Date(entry.date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                      <span className="text-xs text-gray-500">
                        Цикл {entry.cycle}, День {entry.cycleDay}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Самочувствие:</span>
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < entry.wellbeingSeverity 
                                ? "bg-yellow-400" 
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-1">📝</div>
                <div className="text-xs font-medium text-gray-700">Новая запись</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-1">💡</div>
                <div className="text-xs font-medium text-gray-700">Рекомендации</div>
              </div>
            </div>
          </Card>
        </Link>

        {/* Mutual Help Section */}
        <Link href="/help">
          <Card className="bg-soft-yellow rounded-2xl p-6 mb-6 shadow-soft border-0 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Взаимопомощь</h3>
                <p className="text-sm text-gray-600">Мы помогаем друг другу. Получите или окажите помощь.</p>
              </div>
              <Button variant="ghost" size="icon" className="w-10 h-10 bg-white rounded-xl shadow-soft hover:scale-105 transition-transform">
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Active Requests Preview */}
            {helpRequests && helpRequests.length > 0 && (
              <div className="bg-white rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-800">Активные запросы рядом</span>
                  <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full">
                    {helpRequests.length} новых
                  </span>
                </div>
                <div className="space-y-2">
                  {helpRequests.map((request) => (
                    <div key={request.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-soft-blue rounded-full flex items-center justify-center text-sm">
                        {request.helpType === 'walk' && '🚶'}
                        {request.helpType === 'cooking' && '🍲'}
                        {request.helpType === 'medicine' && '💊'}
                        {request.helpType === 'transport' && '🚗'}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{request.title}</div>
                        <div className="text-xs text-gray-500">
                          {(request as any).user?.name}, {request.location || 'рядом'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-1">🙋‍♀️</div>
                <div className="text-xs font-medium text-gray-700">Попросить помощь</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-1">🤝</div>
                <div className="text-xs font-medium text-gray-700">Предложить помощь</div>
              </div>
            </div>
          </Card>
        </Link>

        {/* Recommended Articles Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Рекомендации для вас</h3>
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-soft-purple rounded-2xl p-5 shadow-soft border-0 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
                  <BookOpen className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-800 mb-1">Психология</h4>
                  <p className="text-sm text-gray-600">Как справляться с эмоциями во время лечения</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>

            <Card className="bg-soft-green rounded-2xl p-5 shadow-soft border-0 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
                  <Utensils className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-800 mb-1">Питание</h4>
                  <p className="text-sm text-gray-600">Правильное питание для поддержания сил</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>

            <Card className="bg-soft-orange rounded-2xl p-5 shadow-soft border-0 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
                  <Activity className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-800 mb-1">Активность</h4>
                  <p className="text-sm text-gray-600">Безопасные упражнения во время терапии</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          </div>
        </div>

      </main>
    </Layout>
  );
}
