import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { InstagramPost } from './InstagramPost';
import { PostContent } from './PostContent';
import { Calendar, Clock, User, Phone } from 'lucide-react';

interface BookingPostProps {
  postIndex: number;
  isActive?: boolean;
}

export const BookingPost = ({ postIndex, isActive }: BookingPostProps) => {
  const { language } = useLanguage();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const title = language === 'nl' 
    ? 'Plan Uw Gratis Consultatie' 
    : 'Schedule Your Free Consultation';
    
  const description = language === 'nl'
    ? 'Ontdek wat de beste behandeling voor u is. Onze experts staan klaar om al uw vragen te beantwoorden en een persoonlijk behandelplan op te stellen.'
    : 'Discover what the best treatment is for you. Our experts are ready to answer all your questions and create a personalized treatment plan.';

  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  return (
    <InstagramPost postIndex={postIndex} isActive={isActive} className="bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center">
            <Calendar className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {title}
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm">
            <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">
              {language === 'nl' ? '30 Minuten' : '30 Minutes'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'nl' ? 'Gratis consultatie' : 'Free consultation'}
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm">
            <User className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">
              {language === 'nl' ? 'Expert Advies' : 'Expert Advice'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'nl' ? 'Persoonlijk behandelplan' : 'Personal treatment plan'}
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm">
            <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">
              {language === 'nl' ? 'Geen Verplichtingen' : 'No Obligations'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'nl' ? 'Vrijblijvend gesprek' : 'No-obligation discussion'}
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="max-w-2xl mx-auto w-full">
          <div className="bg-background rounded-2xl p-8 shadow-lg border border-border">
            <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
              {language === 'nl' ? 'Kies Uw Tijd' : 'Choose Your Time'}
            </h3>
            
            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  {language === 'nl' ? 'Selecteer Datum' : 'Select Date'}
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  {language === 'nl' ? 'Selecteer Tijd' : 'Select Time'}
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                        selectedTime === time
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-foreground border-border hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={language === 'nl' ? 'Uw naam' : 'Your name'}
                  className="px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder={language === 'nl' ? 'Telefoonnummer' : 'Phone number'}
                  className="px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Book Button */}
              <button 
                disabled={!selectedDate || !selectedTime}
                className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'nl' ? 'Boek Nu - Gratis Consultatie' : 'Book Now - Free Consultation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </InstagramPost>
  );
};