import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, Check, X } from "lucide-react";
import { notificationService } from "@/lib/notifications";
import { useToast } from "@/hooks/use-toast";

export default function NotificationSettings() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState({
    medicationReminders: true,
    supportiveMessages: true,
    activitySuggestions: true,
    therapyReminders: true
  });
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check support and permission status
    setIsSupported(notificationService.isSupported());
    setPermission(notificationService.getPermissionStatus());

    // Load saved settings
    const saved = localStorage.getItem('notification_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      }
    }
  }, []);

  const handleEnableNotifications = async () => {
    setIsInitializing(true);
    
    try {
      const success = await notificationService.initialize();
      if (success) {
        setPermission('granted');
        toast({
          title: "Уведомления включены!",
          description: "Теперь вы будете получать напоминания и поддержку",
        });

        // Show test notification
        await notificationService.showNotification(
          "Уведомления настроены!",
          "Теперь вы будете получать полезные напоминания о лечении",
          "support"
        );
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось включить уведомления. Проверьте разрешения браузера",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при настройке уведомлений",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notification_settings', JSON.stringify(newSettings));
  };

  const testNotification = async (type: 'medication' | 'support' | 'activity') => {
    if (permission !== 'granted') return;

    const notifications = {
      medication: {
        title: "💊 Тест: Напоминание о лекарстве",
        body: "Время принять Тамоксифен"
      },
      support: {
        title: "💚 Тест: Поддержка",
        body: "Вы справляетесь отлично! Каждый день лечения приближает вас к выздоровлению"
      },
      activity: {
        title: "🏃‍♀️ Тест: Активность",
        body: "Легкая прогулка поможет улучшить самочувствие и поднять настроение"
      }
    };

    const notification = notifications[type];
    await notificationService.showNotification(notification.title, notification.body, type);

    toast({
      title: "Тестовое уведомление отправлено",
      description: "Проверьте, появилось ли уведомление"
    });
  };

  if (!isSupported) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <BellOff className="w-5 h-5 text-gray-400" />
          <h3 className="font-semibold text-gray-800">Уведомления недоступны</h3>
        </div>
        <p className="text-sm text-gray-600">
          Ваш браузер не поддерживает push-уведомления
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Bell className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-800">Настройки уведомлений</h3>
      </div>

      {permission !== 'granted' ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Включите уведомления, чтобы получать напоминания о приеме лекарств и поддерживающие сообщения
          </p>
          <Button 
            onClick={handleEnableNotifications}
            disabled={isInitializing}
            className="w-full"
          >
            {isInitializing ? "Настройка..." : "Включить уведомления"}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-green-600 text-sm">
            <Check className="w-4 h-4" />
            <span>Уведомления включены</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="medication-reminders" className="text-sm font-medium">
                Напоминания о лекарствах
              </Label>
              <Switch
                id="medication-reminders"
                checked={settings.medicationReminders}
                onCheckedChange={(checked) => handleSettingChange('medicationReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="supportive-messages" className="text-sm font-medium">
                Поддерживающие сообщения
              </Label>
              <Switch
                id="supportive-messages"
                checked={settings.supportiveMessages}
                onCheckedChange={(checked) => handleSettingChange('supportiveMessages', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="activity-suggestions" className="text-sm font-medium">
                Рекомендации активности
              </Label>
              <Switch
                id="activity-suggestions"
                checked={settings.activitySuggestions}
                onCheckedChange={(checked) => handleSettingChange('activitySuggestions', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="therapy-reminders" className="text-sm font-medium">
                Напоминания о терапии
              </Label>
              <Switch
                id="therapy-reminders"
                checked={settings.therapyReminders}
                onCheckedChange={(checked) => handleSettingChange('therapyReminders', checked)}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Тестовые уведомления
            </Label>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => testNotification('medication')}
                disabled={!settings.medicationReminders}
              >
                Тест: Лекарство
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => testNotification('support')}
                disabled={!settings.supportiveMessages}
              >
                Тест: Поддержка
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => testNotification('activity')}
                disabled={!settings.activitySuggestions}
              >
                Тест: Активность
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}