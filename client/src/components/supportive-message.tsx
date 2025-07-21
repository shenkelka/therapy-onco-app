interface SupportiveMessageProps {
  treatmentType?: string;
  sideEffects?: string[];
}

const supportiveMessages = {
  default: "Помните: каждый день вашего лечения - это шаг к выздоровлению. Вы справляетесь!",
  chemotherapy: "Химиотерапия - серьезный шаг в борьбе с болезнью. Ваша сила и решимость помогут пройти этот путь!",
  targeted: "Таргетная терапия работает точно и эффективно. Доверьтесь процессу - вы на правильном пути!",
  immunotherapy: "Ваша иммунная система становится сильнее. Каждый день лечения укрепляет ваши защитные силы!",
  radiation: "Лучевая терапия действует локально и точно. Ваше тело восстанавливается с каждым днем!",
  withSideEffects: "Побочные эффекты - это знак того, что лечение работает. Ваш организм борется и побеждает!",
  nausea: "Тошнота пройдет, а польза от лечения останется. Попробуйте имбирный чай и маленькие порции еды.",
  fatigue: "Усталость - естественная реакция организма. Отдыхайте больше, это поможет восстановлению.",
};

export default function SupportiveMessage({ treatmentType, sideEffects }: SupportiveMessageProps) {
  const getMessage = () => {
    // If there are side effects, prioritize specific messages
    if (sideEffects && sideEffects.length > 0) {
      if (sideEffects.includes("Тошнота")) {
        return supportiveMessages.nausea;
      }
      if (sideEffects.includes("Усталость")) {
        return supportiveMessages.fatigue;
      }
      return supportiveMessages.withSideEffects;
    }

    // Treatment-specific messages
    if (treatmentType && treatmentType in supportiveMessages) {
      return supportiveMessages[treatmentType as keyof typeof supportiveMessages];
    }

    return supportiveMessages.default;
  };

  return (
    <div className="bg-soft-mint p-4 rounded-xl border-l-4 border-emerald-400">
      <p className="text-sm text-gray-700">💚 {getMessage()}</p>
    </div>
  );
}
