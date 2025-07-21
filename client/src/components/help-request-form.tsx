import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertHelpRequestSchema } from "@shared/schema";

const formSchema = insertHelpRequestSchema;
type FormData = z.infer<typeof formSchema>;

interface HelpRequestFormProps {
  onSuccess: () => void;
}

const helpTypes = [
  { value: "walk", label: "Прогулка", icon: "🚶‍♀️", description: "Погулять вместе" },
  { value: "cooking", label: "Готовка", icon: "🍲", description: "Приготовить еду" },
  { value: "medicine", label: "Лекарства", icon: "💊", description: "Привезти препараты" },
  { value: "transport", label: "Транспорт", icon: "🚗", description: "Помочь добраться" },
];

export default function HelpRequestForm({ onSuccess }: HelpRequestFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      helpType: "",
      location: "",
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("POST", "/api/help-requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Запрос создан!",
        description: "Ваш запрос на помощь опубликован",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/help-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/help-requests/my"] });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось создать запрос",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createRequestMutation.mutate(data);
  };

  const selectedHelpType = form.watch("helpType");

  return (
    <div className="bg-white rounded-t-3xl w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Запрос на помощь</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSuccess}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-600" />
          </Button>
        </div>

        {/* Help Type Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-4 block">Тип помощи</Label>
          <div className="grid grid-cols-2 gap-3">
            {helpTypes.map((type) => (
              <Button
                key={type.value}
                type="button"
                variant={selectedHelpType === type.value ? "default" : "outline"}
                onClick={() => {
                  form.setValue("helpType", type.value);
                  if (!form.getValues("title")) {
                    form.setValue("title", type.label);
                  }
                }}
                className="h-auto p-4 text-center hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                  <div className="text-xs text-gray-600">{type.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Заголовок</Label>
            <Input
              {...form.register('title')}
              placeholder="Кратко опишите, что нужно..."
              className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Описание</Label>
            <Textarea
              {...form.register('description')}
              placeholder="Расскажите подробнее о том, какая помощь нужна..."
              className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Местоположение (необязательно)</Label>
            <Input
              {...form.register('location')}
              placeholder="Район, адрес или ориентир..."
              className="mt-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Supportive Message */}
          <div className="bg-soft-mint p-4 rounded-xl border-l-4 border-emerald-400">
            <p className="text-sm text-gray-700">
              💚 Не стесняйтесь просить о помощи. Сообщество онкопациентов всегда готово поддержать друг друга!
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={createRequestMutation.isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl"
          >
            {createRequestMutation.isPending ? "Создается..." : "Создать запрос"}
          </Button>
        </form>
      </div>
    </div>
  );
}
