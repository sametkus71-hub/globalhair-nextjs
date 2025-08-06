import { cn } from '@/lib/utils';

interface ReviewCard {
  id: number;
  name: string;
  treatment: string;
  bgColor: string;
}

const REVIEW_CARDS: ReviewCard[] = [
  { id: 1, name: 'Naam achternaam', treatment: 'Behandeling', bgColor: 'bg-gray-300' },
  { id: 2, name: 'Naam achternaam', treatment: 'Behandeling', bgColor: 'bg-gray-400' },
  { id: 3, name: 'Naam achternaam', treatment: 'Behandeling', bgColor: 'bg-gray-500' },
  { id: 4, name: 'Naam achternaam', treatment: 'Behandeling', bgColor: 'bg-gray-200' },
  { id: 5, name: 'Naam achternaam', treatment: 'Behandeling', bgColor: 'bg-gray-600' },
  { id: 6, name: 'Naam achternaam', treatment: 'Behandeling', bgColor: 'bg-gray-350' },
  { id: 7, name: 'Naam achternaam', treatment: 'Behandeling', bgColor: 'bg-gray-450' },
  { id: 8, name: 'Naam achternaam', treatment: 'Behandeling', bgColor: 'bg-gray-250' },
  { id: 9, name: 'Naam achternaam', treatment: 'Behandeling', bgColor: 'bg-gray-550' }
];

export const ReviewsGrid = () => {
  return (
    <div className="w-full h-full p-4">
      <div 
        className="grid grid-cols-3 grid-rows-3 w-full h-full gap-2"
      >
        {REVIEW_CARDS.map((card) => (
          <div
            key={card.id}
            className={cn(
              "w-full h-full rounded-lg flex flex-col justify-end p-3 relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity",
              card.bgColor
            )}
          >
            {/* Content at bottom */}
            <div className="text-white">
              <div className="text-sm font-medium leading-tight mb-1">
                {card.name}
              </div>
              <div className="text-xs opacity-80 leading-tight">
                {card.treatment}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};