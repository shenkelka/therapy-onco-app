import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { notificationService } from "@/lib/notifications";
import { simpleNotificationService } from "@/lib/simple-notifications";
import { Bell, Clock, Heart, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NotificationTest() {
  const { toast } = useToast();

  const testNotification = async () => {
    try {
      // Check browser support first
      if (!notificationService.isSupported()) {
        toast({
          title: "Не поддерживается",
          description: "Ваш браузер не поддерживает уведомления",
          variant: "destructive",
        });
        return;
      }

      // Check and request permission
      const permission = await notificationService.requestPermission();
      console.log('Permission status:', permission);
      
      if (permission === 'denied') {
        toast({
          title: "Доступ заблокирован",
          description: "Уведомления заблокированы в настройках браузера",
          variant: "destructive",
        });
        return;
      }

      if (permission !== 'granted') {
        toast({
          title: "Разрешение необходимо",
          description: "Дайте разрешение на показ уведомлений",
          variant: "destructive",
        });
        return;
      }

      // Try to show notification
      await notificationService.showNotification(
        "✅ Тест успешен",
        "Система уведомлений работает!"
      );
      
      toast({
        title: "Уведомление отправлено",
        description: "Проверьте, появилось ли уведомление",
      });
    } catch (error) {
      console.error('Notification test error:', error);
      const errorMsg = error instanceof Error ? error.message : "Неизвестная ошибка";
      toast({
        title: "Ошибка тестирования",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const testMedicationReminder = async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setMinutes(tomorrow.getMinutes() + 1); // 1 minute from now
      await notificationService.scheduleMedicationReminder(
        "Темозоломид",
        tomorrow.toISOString(),
        "Принимать во время еды"
      );
      toast({
        title: "Напоминание запланировано",
        description: "Через 1 минуту придет напоминание о лекарстве",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось запланировать напоминание",
        variant: "destructive",
      });
    }
  };

  const testSupportiveMessage = async () => {
    try {
      await notificationService.sendSupportiveMessage(
        "Вы справляетесь отлично! Каждый день лечения приближает к выздоровлению.",
        "химиотерапия",
        ["тошнота", "усталость"]
      );
      toast({
        title: "Поддержка отправлена",
        description: "Сообщение поддержки доставлено",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить поддержку",
        variant: "destructive",
      });
    }
  };

  const testActivitySuggestion = async () => {
    try {
      await notificationService.suggestActivity(
        "10-минутная прогулка на свежем воздухе",
        "Легкая активность поможет улучшить настроение"
      );
      toast({
        title: "Активность предложена",
        description: "Рекомендация отправлена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось предложить активность",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Bell className="w-5 h-5" />
        Тест уведомлений
      </h3>
      
      <div className="space-y-3">
        <Button 
          onClick={testNotification} 
          variant="outline" 
          className="w-full justify-start"
        >
          <Bell className="w-4 h-4 mr-2" />
          Тестовое уведомление
        </Button>

        <Button 
          onClick={async () => {
            try {
              const permission = await simpleNotificationService.requestPermission();
              if (permission === 'granted') {
                const success = await simpleNotificationService.showNotification(
                  "Простой тест",
                  "Упрощенная система уведомлений работает!"
                );
                toast({
                  title: success ? "Простое уведомление отправлено" : "Ошибка отправки",
                  description: success ? "Проверьте результат" : "Не удалось показать уведомление",
                  variant: success ? "default" : "destructive"
                });
              } else {
                toast({
                  title: "Нет разрешения",
                  description: `Статус: ${permission}`,
                  variant: "destructive"
                });
              }
            } catch (error) {
              toast({
                title: "Ошибка простого теста",
                description: error instanceof Error ? error.message : "Неизвестная ошибка",
                variant: "destructive"
              });
            }
          }}
          variant="outline" 
          className="w-full justify-start bg-blue-50"
        >
          <Bell className="w-4 h-4 mr-2" />
          Простой тест (без Service Worker)
        </Button>

        <Button 
          onClick={testMedicationReminder} 
          variant="outline" 
          className="w-full justify-start"
        >
          <Clock className="w-4 h-4 mr-2" />
          Напоминание о лекарстве (через 1 мин)
        </Button>

        <Button 
          onClick={testSupportiveMessage} 
          variant="outline" 
          className="w-full justify-start"
        >
          <Heart className="w-4 h-4 mr-2" />
          Поддерживающее сообщение
        </Button>

        <Button 
          onClick={testActivitySuggestion} 
          variant="outline" 
          className="w-full justify-start"
        >
          <Activity className="w-4 h-4 mr-2" />
          Рекомендация активности
        </Button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 mb-2">Диагностика:</p>
        <div className="space-y-1 text-xs text-gray-500">
          <div>Браузер: {navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'}</div>
          <div>API поддержка: {'Notification' in window ? '✅' : '❌'}</div>
          <div>Текущий статус: {notificationService.getPermissionStatus()}</div>
        </div>
      </div>
    </Card>
  );
}