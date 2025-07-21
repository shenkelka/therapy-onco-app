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
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertTherapyEntrySchema } from "@shared/schema";
import SupportiveMessage from "./supportive-message";

const formSchema = insertTherapyEntrySchema.extend({
  sideEffects: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof formSchema>;

interface TherapyFormProps {
  onSuccess: () => void;
}

export default function TherapyForm({ onSuccess }: TherapyFormProps) {
  const [selectedWellbeing, setSelectedWellbeing] = useState<number | null>(null);
  const [sideEffects, setSideEffects] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      cycle: 1,
      cycleDay: 1,
      treatmentType: "",
      medications: "",
      wellbeingSeverity: 3,
      sideEffects: [],
      physicalActivity: "",
      mood: "😊",
    },
  });

  const createEntryMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("POST", "/api/therapy-entries", data);
    },
    onSuccess: () => {
      toast({
        title: "Запись сохранена!",
        description: "Ваша запись о терапии успешно добавлена",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/therapy-entries"] });
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
          {/* Date and Cycle */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Дата</Label>
              <Input
                type="date"
                {...form.register('date')}
                className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Цикл</Label>
              <Input
                type="number"
                min="1"
                {...form.register('cycle', { valueAsNumber: true })}
                className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Day of Cycle */}
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

          {/* Treatment Type */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Тип лечения</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                { value: "chemotherapy", label: "Химиотерапия" },
                { value: "targeted", label: "Таргетная" },
                { value: "immunotherapy", label: "Иммунотерапия" },
                { value: "radiation", label: "Лучевая" },
              ].map((treatment) => (
                <label key={treatment.value} className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value={treatment.value}
                    {...form.register('treatmentType')}
                    className="mr-2"
                  />
                  <span className="text-sm">{treatment.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Medications */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Препараты</Label>
            <Textarea
              placeholder="Укажите препараты..."
              {...form.register('medications')}
              className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
            />
          </div>

          {/* Wellbeing Scale */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Тяжесть самочувствия (1-5)</Label>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl mt-2">
              <span className="text-sm text-gray-500">Отлично</span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    type="button"
                    onClick={() => handleWellbeingSelect(rating)}
                    className={`w-10 h-10 rounded-full transition-colors ${
                      selectedWellbeing === rating ? "ring-2 ring-purple-500" : ""
                    } ${
                      rating === 1 ? "bg-green-200 hover:bg-green-300" :
                      rating === 2 ? "bg-yellow-200 hover:bg-yellow-300" :
                      rating === 3 ? "bg-orange-200 hover:bg-orange-300" :
                      rating === 4 ? "bg-red-200 hover:bg-red-300" :
                      "bg-red-300 hover:bg-red-400"
                    }`}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
              <span className="text-sm text-gray-500">Плохо</span>
            </div>
          </div>

          {/* Side Effects */}
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
                "Аппетит",
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

          {/* Physical Activity */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Физическая активность</Label>
            <Select onValueChange={(value) => form.setValue('physicalActivity', value)}>
              <SelectTrigger className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <SelectValue placeholder="Выберите уровень активности" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Без активности</SelectItem>
                <SelectItem value="light">Легкая прогулка</SelectItem>
                <SelectItem value="moderate">Умеренная активность</SelectItem>
                <SelectItem value="intense">Интенсивные упражнения</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Supportive Message */}
          <SupportiveMessage 
            treatmentType={watchTreatmentType} 
            sideEffects={watchSideEffects}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={createEntryMutation.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-xl"
          >
            {createEntryMutation.isPending ? "Сохраняется..." : "Сохранить запись"}
          </Button>
        </form>
      </div>
    </div>
  );
}
