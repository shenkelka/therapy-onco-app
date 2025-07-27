import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout";
import HelpRequestForm from "@/components/help-request-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Users, Heart } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function MutualHelp() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: helpRequests, isLoading } = useQuery({
    queryKey: ["/api/help-requests"],
  });

  const { data: myRequests } = useQuery({
    queryKey: ["/api/help-requests/my"],
  });

  const offerHelpMutation = useMutation({
    mutationFn: async (requestId: number) => {
      return await apiRequest("POST", "/api/help-responses", {
        helpRequestId: requestId,
        message: "Я готов помочь!"
      });
    },
    onSuccess: () => {
      toast({
        title: "Отлично!",
        description: "Ваше предложение помощи отправлено",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/help-requests"] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить предложение помощи",
        variant: "destructive",
      });
    },
  });

  const getHelpTypeIcon = (type: string) => {
    const icons = {
      walk: '🚶‍♀️',
      cooking: '🍲',
      medicine: '💊',
      transport: '🚗'
    };
    return icons[type as keyof typeof icons] || '🤝';
  };

  const getHelpTypeLabel = (type: string) => {
    const labels = {
      walk: 'Прогулка',
      cooking: 'Готовка',
      medicine: 'Лекарства',
      transport: 'Транспорт'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getHelpTypeColor = (type: string) => {
    const colors = {
      walk: 'bg-soft-blue',
      cooking: 'bg-soft-pink',
      medicine: 'bg-soft-green',
      transport: 'bg-soft-orange'
    };
    return colors[type as keyof typeof colors] || 'bg-soft-mint';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout currentPage="help">
      <div className="px-6 lg:px-8 xl:px-12 pt-6 lg:pt-8 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="w-10 h-10 bg-white rounded-xl shadow-soft">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Взаимопомощь</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10 bg-white rounded-xl shadow-soft">
                <Plus className="w-5 h-5 text-gray-600" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto p-0 border-0">
              <HelpRequestForm onSuccess={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Help Types */}
        <Card className="bg-white rounded-2xl p-6 shadow-soft border-0 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Виды помощи</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-soft-blue p-4 rounded-xl text-center">
              <div className="text-3xl mb-2">🚶‍♀️</div>
              <div className="text-sm font-medium text-gray-800">Прогулка</div>
              <div className="text-xs text-gray-600">Погулять вместе</div>
            </div>
            <div className="bg-soft-pink p-4 rounded-xl text-center">
              <div className="text-3xl mb-2">🍲</div>
              <div className="text-sm font-medium text-gray-800">Готовка</div>
              <div className="text-xs text-gray-600">Приготовить еду</div>
            </div>
            <div className="bg-soft-green p-4 rounded-xl text-center">
              <div className="text-3xl mb-2">💊</div>
              <div className="text-sm font-medium text-gray-800">Лекарства</div>
              <div className="text-xs text-gray-600">Привезти препараты</div>
            </div>
            <div className="bg-soft-orange p-4 rounded-xl text-center">
              <div className="text-3xl mb-2">🚗</div>
              <div className="text-sm font-medium text-gray-800">Транспорт</div>
              <div className="text-xs text-gray-600">Помочь добраться</div>
            </div>
          </div>
        </Card>
      </div>

      <main className="px-6 lg:px-8 xl:px-12 pb-24 lg:pb-28 xl:pb-32">
        {/* My Requests */}
        {myRequests && myRequests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Мои запросы
            </h3>
            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
              {myRequests.map((request: any) => (
                <Card key={request.id} className="bg-white rounded-2xl p-4 shadow-soft border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getHelpTypeColor(request.helpType)}`}>
                        {getHelpTypeIcon(request.helpType)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{request.title}</div>
                        <div className="text-xs text-gray-500">{formatDate(request.createdAt)}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {request.status === 'active' ? 'Активен' : 'Завершён'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{request.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Help Requests */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            Запросы рядом с вами
          </h3>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Загрузка запросов...</div>
            </div>
          ) : !helpRequests || helpRequests.length === 0 ? (
            <Card className="bg-white rounded-2xl p-8 shadow-soft border-0 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Пока нет активных запросов</h3>
              <p className="text-sm text-gray-600 mb-4">
                Создайте свой запрос или подождите новых обращений
              </p>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Создать запрос
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto p-0 border-0">
                  <HelpRequestForm onSuccess={() => setIsFormOpen(false)} />
                </DialogContent>
              </Dialog>
            </Card>
          ) : (
            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 xl:grid-cols-3">
              {helpRequests.map((request: any) => (
                <Card key={request.id} className="bg-white rounded-2xl p-4 shadow-soft border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getHelpTypeColor(request.helpType)}`}>
                        {getHelpTypeIcon(request.helpType)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{request.title}</div>
                        <div className="text-xs text-gray-500">
                          {request.user?.name}{request.user?.age && `, ${request.user.age} лет`}
                          {request.location && ` • ${request.location}`}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {getHelpTypeLabel(request.helpType)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatDate(request.createdAt)}
                    </span>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white"
                      onClick={() => offerHelpMutation.mutate(request.id)}
                      disabled={offerHelpMutation.isPending}
                    >
                      {offerHelpMutation.isPending ? "Отправляется..." : "Предложить помощь"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Create Request Button */}
        <div className="mt-8">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl">
                Создать запрос на помощь
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto p-0 border-0">
              <HelpRequestForm onSuccess={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </Layout>
  );
}
