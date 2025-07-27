import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Clock, Activity, Target, Shield, Dna, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertTherapyEntrySchema } from "@shared/schema";
import SupportiveMessage from "./supportive-message";
import { notificationService } from "@/lib/notifications";

const formSchema = insertTherapyEntrySchema.extend({
  sideEffects: z.array(z.string()).default([]),
  physicalActivityType: z.string().optional(),
  comments: z.string().optional(),
  reminder: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TherapyFormProps {
  onSuccess: () => void;
  entry?: any; // For editing existing entries
}

export default function TherapyForm({ onSuccess, entry }: TherapyFormProps) {
  const [selectedWellbeing, setSelectedWellbeing] = useState<number | null>(entry?.wellbeingSeverity || null);
  const [sideEffects, setSideEffects] = useState<string[]>(entry?.sideEffects || []);
  const [customMedication, setCustomMedication] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: entry ? {
      date: entry.date,
      cycle: entry.cycle,
      cycleDay: entry.cycleDay,
      treatmentType: entry.treatmentType,
      medications: entry.medications,
      wellbeingSeverity: entry.wellbeingSeverity,
      sideEffects: entry.sideEffects || [],
      physicalActivity: entry.physicalActivity,
      physicalActivityType: entry.physicalActivityType || "",
      comments: entry.comments || "",
      reminder: entry.reminder || "",
      mood: entry.mood || "😊",
    } : {
      date: new Date().toISOString().split('T')[0],
      cycle: undefined,
      cycleDay: undefined,
      treatmentType: "",
      medications: "",
      wellbeingSeverity: 3,
      sideEffects: [],
      physicalActivity: "",
      physicalActivityType: "",
      comments: "",
      reminder: "",
      mood: "😊",
    },
  });

  const createEntryMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (entry) {
        return await apiRequest("PUT", `/api/therapy-entries/${entry.id}`, data);
      } else {
        return await apiRequest("POST", "/api/therapy-entries", data);
      }
    },
    onSuccess: async (_, data) => {
      toast({
        title: entry ? "Запись обновлена!" : "Запись сохранена!",
        description: entry ? "Ваша запись о терапии успешно обновлена" : "Ваша запись о терапии успешно добавлена",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/therapy-entries"] });

      // Schedule notifications based on therapy entry
      try {
        // Send supportive message
        if (data.sideEffects && data.sideEffects.length > 0) {
          await notificationService.sendSupportiveMessage(
            "Помните: побочные эффекты временны, а ваша сила - постоянна. Каждый день лечения приближает к выздоровлению.",
            data.treatmentType,
            data.sideEffects
          );
        }

        // Schedule medication reminder if reminder text is provided
        if (data.reminder && data.medications) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          await notificationService.scheduleMedicationReminder(
            data.medications,
            tomorrow.toISOString(),
            data.reminder
          );
        }

        // Suggest activity if none reported
        if (data.physicalActivity === 'none') {
          setTimeout(async () => {
            await notificationService.suggestActivity(
              "Легкая 10-минутная прогулка",
              "Даже небольшая активность может улучшить самочувствие"
            );
          }, 5000); // 5 seconds delay
        }
      } catch (error) {
        console.warn('Failed to schedule notifications:', error);
      }

      onSuccess();
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить запись",
        variant: "destructive",
      });
    },
  });

  const handleSideEffectChange = (effect: string, checked: boolean) => {
    const newEffects = checked
      ? [...sideEffects, effect]
      : sideEffects.filter(e => e !== effect);
    setSideEffects(newEffects);
    form.setValue('sideEffects', newEffects);
  };

  const handleWellbeingSelect = (rating: number) => {
    setSelectedWellbeing(rating);
    form.setValue('wellbeingSeverity', rating);
  };

  const onSubmit = (data: FormData) => {
    createEntryMutation.mutate({
      ...data,
      sideEffects,
      wellbeingSeverity: selectedWellbeing || data.wellbeingSeverity,
    });
  };

  const watchTreatmentType = form.watch('treatmentType');
  const watchSideEffects = form.watch('sideEffects');
  const watchPhysicalActivity = form.watch('physicalActivity');

  return (
    <div className="bg-white rounded-t-3xl w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Дневник терапии</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSuccess}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-600" />
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 1. Дата */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Дата</Label>
            <Input
              type="date"
              {...form.register('date')}
              className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* 2. Вид терапии */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Вид терапии</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                { value: "chemotherapy", label: "Химиотерапия", icon: Activity, color: "bg-blue-50 hover:bg-blue-100 border-blue-200" },
                { value: "targeted", label: "Таргетная", icon: Target, color: "bg-green-50 hover:bg-green-100 border-green-200" },
                { value: "immunotherapy", label: "Иммунотерапия", icon: Shield, color: "bg-purple-50 hover:bg-purple-100 border-purple-200" },
                { value: "hormonal", label: "Гормональная", icon: Dna, color: "bg-pink-50 hover:bg-pink-100 border-pink-200" },
                { value: "radiation", label: "Лучевая", icon: Zap, color: "bg-orange-50 hover:bg-orange-100 border-orange-200" },
              ].map((treatment) => {
                const Icon = treatment.icon;
                const isSelected = form.watch('treatmentType') === treatment.value;
                return (
                  <label 
                    key={treatment.value} 
                    className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      isSelected 
                        ? treatment.color.replace('hover:', '') + ' ring-2 ring-purple-500' 
                        : treatment.color
                    }`}
                  >
                    <input
                      type="radio"
                      value={treatment.value}
                      {...form.register('treatmentType')}
                      className="sr-only"
                    />
                    <Icon className="w-6 h-6 mb-2 text-gray-600" />
                    <span className="text-sm font-medium text-center">{treatment.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. Условные поля для стандартных терапий */}
          {watchTreatmentType && watchTreatmentType !== "" && (
            <>
              {/* Цикл и День цикла */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Цикл</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    {...form.register('cycle', { valueAsNumber: true })}
                    className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">День цикла</Label>
                  <Input
                    type="number"
                    min="1"
                    max="21"
                    placeholder="1-21"
                    {...form.register('cycleDay', { valueAsNumber: true })}
                    className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Препараты */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Препараты</Label>
                <Select onValueChange={(value) => {
                  if (value === "custom") {
                    setCustomMedication(true);
                    form.setValue('medications', '');
                  } else {
                    setCustomMedication(false);
                    form.setValue('medications', value);
                  }
                }}>
                  <SelectTrigger className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <SelectValue placeholder="Выберите препарат" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Доксорубицин">Доксорубицин</SelectItem>
                    <SelectItem value="Циклофосфамид">Циклофосфамид</SelectItem>
                    <SelectItem value="Паклитаксел">Паклитаксел</SelectItem>
                    <SelectItem value="Карбоплатин">Карбоплатин</SelectItem>
                    <SelectItem value="Герцептин">Герцептин</SelectItem>
                    <SelectItem value="Пертузумаб">Пертузумаб</SelectItem>
                    <SelectItem value="Тамоксифен">Тамоксифен</SelectItem>
                    <SelectItem value="Летрозол">Летрозол</SelectItem>
                    <SelectItem value="custom">Свой вариант</SelectItem>
                  </SelectContent>
                </Select>
                
                {customMedication && (
                  <Input
                    placeholder="Введите название препарата..."
                    {...form.register('medications')}
                    className="mt-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                )}
              </div>

              {/* Самочувствие - Improved Scale */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Самочувствие от 1 до 6</Label>
                <div className="p-4 bg-gray-50 rounded-xl mt-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500">Очень плохо</span>
                    <span className="text-xs text-gray-500">Отлично</span>
                  </div>
                  <div className="relative">
                    {/* Scale Background */}
                    <div className="w-full h-2 bg-gray-200 rounded-full relative">
                      <div 
                        className="h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full transition-all duration-300"
                        style={{ width: selectedWellbeing ? `${(selectedWellbeing / 6) * 100}%` : '0%' }}
                      />
                    </div>
                    {/* Scale Points */}
                    <div className="flex justify-between mt-2">
                      {[1, 2, 3, 4, 5, 6].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleWellbeingSelect(rating)}
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center text-sm font-medium ${
                            selectedWellbeing === rating 
                              ? "border-purple-500 bg-purple-500 text-white shadow-lg scale-110" 
                              : "border-gray-300 bg-white text-gray-600 hover:border-purple-300 hover:scale-105"
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                    {selectedWellbeing && (
                      <div className="text-center mt-3">
                        <span className={`text-sm font-medium ${
                          selectedWellbeing >= 5 ? "text-green-600" :
                          selectedWellbeing >= 3 ? "text-yellow-600" :
                          "text-red-600"
                        }`}>
                          {selectedWellbeing === 1 ? "Очень плохо" :
                           selectedWellbeing === 2 ? "Плохо" :
                           selectedWellbeing === 3 ? "Нормально" :
                           selectedWellbeing === 4 ? "Хорошо" :
                           selectedWellbeing === 5 ? "Очень хорошо" :
                           "Отлично"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Побочные эффекты */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Побочные эффекты</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "Тошнота",
                    "Усталость", 
                    "Выпадение волос",
                    "Боль",
                    "Диарея",
                    "Рвота",
                    "Потеря аппетита",
                    "Слабость"
                  ].map((effect) => (
                    <label key={effect} className="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Checkbox
                        checked={sideEffects.includes(effect)}
                        onCheckedChange={(checked) => handleSideEffectChange(effect, !!checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{effect}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Комментарий */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Комментарий (опишите ваше самочувствие и какие вспомогательные препараты принимаете)</Label>
                <Textarea
                  placeholder="Опишите ваше самочувствие, дополнительные препараты..."
                  {...form.register('comments')}
                  className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
                />
              </div>

              {/* Физическая активность */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Уровень физической активности</Label>
                <Select onValueChange={(value) => form.setValue('physicalActivity', value)}>
                  <SelectTrigger className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <SelectValue placeholder="Выберите уровень активности" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Нет</SelectItem>
                    <SelectItem value="moderate">Умеренная</SelectItem>
                    <SelectItem value="high">Высокая</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Тип активности (если выбрана умеренная или высокая) */}
              {(watchPhysicalActivity === 'moderate' || watchPhysicalActivity === 'high') && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Какая активность?</Label>
                  <Select onValueChange={(value) => form.setValue('physicalActivityType', value)}>
                    <SelectTrigger className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <SelectValue placeholder="Выберите тип активности" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walking">Прогулка</SelectItem>
                      <SelectItem value="running">Бег</SelectItem>
                      <SelectItem value="cycling">Велосипед</SelectItem>
                      <SelectItem value="gym">Занятие в спортзале</SelectItem>
                      <SelectItem value="swimming">Плавание</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Напоминание для гормональной терапии */}
              {watchTreatmentType === 'hormonal' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Установить напоминание
                  </Label>
                  <Textarea
                    placeholder="Когда принимать следующую таблетку или ставить укол..."
                    {...form.register('reminder')}
                    className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-20 resize-none"
                  />
                </div>
              )}
            </>
          )}

          {/* Поддерживающие фразы */}
          <SupportiveMessage 
            treatmentType={watchTreatmentType} 
            sideEffects={watchSideEffects}
          />

          {/* Кнопка отправки */}
          <Button
            type="submit"
            disabled={createEntryMutation.isPending || !watchTreatmentType}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-xl"
          >
            {createEntryMutation.isPending ? "Сохраняется..." : "Сохранить запись"}
          </Button>
        </form>
      </div>
    </div>
  );
}
