import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout";
import MoodSelector from "@/components/mood-selector";
import NotificationSettings from "@/components/notification-settings";
import NotificationTest from "@/components/notification-test";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Utensils, Activity, Bell, Calendar, TrendingUp, Heart } from "lucide-react";
import { Link } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();
  
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: recentEntries } = useQuery({
    queryKey: ["/api/therapy-entries"],
    select: (data: any[]) => data?.slice(0, isMobile ? 2 : 4), // More entries on desktop
  });

  const { data: helpRequests } = useQuery({
    queryKey: ["/api/help-requests"],
    select: (data: any[]) => data?.slice(0, isMobile ? 2 : 3), // More requests on desktop
  });

  const { data: recommendations } = useQuery({
    queryKey: ["/api/recommendations"],
    enabled: recentEntries && recentEntries.length > 0,
    select: (data) => data,
  });

  return (
    <Layout>
      <div className="px-6 lg:px-8 xl:px-12 pt-6 lg:pt-8 pb-6">
        {/* Desktop Header */}
        {!isMobile && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-semibold text-gray-800">
                  Добро пожаловать, {(user as any)?.name || "Мария"}! 👋
                </h1>
                <p className="text-lg text-gray-600">Как дела с лечением сегодня?</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="bg-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Сегодня
                </Button>
                <Button variant="outline" className="bg-white">
                  <Bell className="w-4 h-4 mr-2" />
                  Уведомления
                </Button>
              </div>
            </div>

            {/* Desktop Stats */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-soft-mint to-emerald-100 p-6 border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Записей в дневнике</p>
                    <p className="text-2xl font-semibold text-gray-800">{recentEntries?.length || 0}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-emerald-600" />
                </div>
              </Card>
              
              <Card className="bg-gradient-to-r from-soft-blue to-blue-100 p-6 border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Активных запросов</p>
                    <p className="text-2xl font-semibold text-gray-800">{helpRequests?.length || 0}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </Card>

              <Card className="bg-gradient-to-r from-soft-yellow to-yellow-100 p-6 border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Помощь оказана</p>
                    <p className="text-2xl font-semibold text-gray-800">12</p>
                  </div>
                  <Heart className="w-8 h-8 text-yellow-600" />
                </div>
              </Card>

              <Card className="bg-gradient-to-r from-soft-purple to-purple-100 p-6 border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Прогресс</p>
                    <p className="text-2xl font-semibold text-gray-800">85%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Mobile Header */}
        {isMobile && (
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
        )}

        {/* Daily Mood Check - Mobile Only */}
        {isMobile && (
          <Card className="bg-white rounded-3xl p-6 shadow-card mb-6 border-0">
            <div className="text-sm text-gray-500 mb-2">Ежедневная рефлексия</div>
            <h2 className="text-2xl font-medium text-gray-900 mb-4">
              Привет, {(user as any)?.name || "Мария"} 👋<br />
              <span className="text-xl">Как ваше самочувствие<br />сегодня?</span>
            </h2>
            
            <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-2xl p-3">
              <div className="text-sm text-gray-600">Ваше настроение</div>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-900 mb-3">Настроение дня</div>
              <MoodSelector />
            </div>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <main className="px-6 lg:px-8 xl:px-12 pb-24 lg:pb-28 xl:pb-32">
        {/* Therapy Diary Section */}
        <Link href="/therapy">
          <Card className="bg-soft-mint rounded-3xl p-6 mb-6 shadow-card border-0 cursor-pointer hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Дневник терапии</h3>
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
          <Card className="bg-soft-yellow rounded-3xl p-6 mb-6 shadow-card border-0 cursor-pointer hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Взаимопомощь</h3>
                <p className="text-sm text-gray-600">Мы помогаем друг другу. Получите или окажите помощь.</p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <ArrowRight className="w-5 h-5" />
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
                  {helpRequests.map((request: any) => (
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">Рекомендации для вас</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card className="bg-soft-purple rounded-3xl p-5 shadow-card border-0 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
                  <BookOpen className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900 mb-1">Психология</h4>
                  <p className="text-sm text-gray-600">Как справляться с эмоциями во время лечения</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>

            <Card className="bg-soft-green rounded-3xl p-5 shadow-card border-0 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
                  <Utensils className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900 mb-1">Питание</h4>
                  <p className="text-sm text-gray-600">Правильное питание для поддержания сил</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>

            <Card className="bg-soft-orange rounded-3xl p-5 shadow-card border-0 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
                  <Activity className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900 mb-1">Активность</h4>
                  <p className="text-sm text-gray-600">Безопасные упражнения во время терапии</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-6">
          <NotificationSettings />
        </div>

        {/* Notification Test (for development) */}
        <div className="mb-6">
          <NotificationTest />
        </div>

      </main>
    </Layout>
  );
}
