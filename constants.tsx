
import { SenseId, SenseData, QuizQuestion } from './types';

export interface PrintableResource {
  id: string;
  title: string;
  type: 'דף צביעה' | 'דף עבודה' | 'תרגול';
  imageUrl: string;
  description: string;
}

export const PRINTABLES: PrintableResource[] = [
  {
    id: 'p1',
    title: 'צביעת חמשת החושים',
    type: 'דף צביעה',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&h=600&q=80&grayscale=true',
    description: 'דף צביעה חביב המציג את כל איברי החושים לצביעה חופשית.'
  },
  {
    id: 'p2',
    title: 'מבוך הראייה',
    type: 'דף עבודה',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&h=600&q=80&grayscale=true',
    description: 'עזרו לעין למצוא את הדרך אל הפרפר הצבעוני במבוך המאתגר.'
  },
  {
    id: 'p3',
    title: 'התאמת חפץ לחוש',
    type: 'תרגול',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=400&h=600&q=80&grayscale=true',
    description: 'מתחו קו בין החפץ לבין האיבר שבעזרתו אנחנו מרגישים אותו.'
  },
  {
    id: 'p4',
    title: 'ממלכת הטעמים',
    type: 'דף צביעה',
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400&h=600&q=80&grayscale=true',
    description: 'צבעו את המאכלים המתוקים והחמוצים בתוך הממלכה של הלשון.'
  }
];

export const SENSES_DATA: SenseData[] = [
  {
    id: SenseId.SIGHT,
    name: 'ראייה',
    organ: 'עיניים',
    description: 'חוש הראייה מאפשר לנו לראות את העולם סביבנו, לזהות צבעים, צורות ומרחקים.',
    color: 'bg-blue-500',
    icon: '👁️',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    printableId: 'p2',
    examples: [
      {
        title: 'קשת בענן',
        description: 'אנחנו רואים את הצבעים המרהיבים של הקשת בעזרת העיניים שלנו.',
        imageUrls: [
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1475139441338-693e7dbe20b6?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        title: 'קריאת ספר',
        description: 'העיניים מזהות את האותיות והמילים המודפסות על הדף.',
        imageUrls: [
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: SenseId.HEARING,
    name: 'שמיעה',
    organ: 'אוזניים',
    description: 'חוש השמיעה מאפשר לנו לקלוט גלי קול ולפרש אותם כצלילים, דיבור או מוזיקה.',
    color: 'bg-yellow-500',
    icon: '👂',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    printableId: 'p3',
    examples: [
      {
        title: 'האזנה למוזיקה',
        description: 'האוזניים קולטות את המנגינה והקצב של הכלים השונים.',
        imageUrls: [
          'https://images.unsplash.com/photo-1514525253361-b83f85df0f5c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        title: 'ציוץ ציפורים',
        description: 'אנחנו יכולים לשמוע את הטבע מתעורר בבוקר.',
        imageUrls: [
          'https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1470688304245-0d71bad18b4c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1520114878144-6123749968dd?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: SenseId.SMELL,
    name: 'ריח',
    organ: 'אף',
    description: 'חוש הריח עוזר לנו לזהות ריחות נעימים או אזהרות (כמו עשן) באוויר.',
    color: 'bg-pink-500',
    icon: '👃',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-886a19591ff2?auto=format&fit=crop&w=1200&q=80',
    printableId: 'p1',
    examples: [
      {
        title: 'פרחים ריחניים',
        description: 'האף קולט את הניחוח המתקתק של פרחים בגינה.',
        imageUrls: [
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1490750967868-886a19591ff2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1464334423240-244e8574103a?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        title: 'ריח של מאפה טרי',
        description: 'אין כמו הריח של לחם חם שיוצא מהתנור!',
        imageUrls: [
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: SenseId.TASTE,
    name: 'טעם',
    organ: 'לשון',
    description: 'חוש הטעם עוזר לנו להבחין בין מתוק, מלוח, חמוץ ומר.',
    color: 'bg-red-500',
    icon: '👅',
    imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=1200&q=80',
    printableId: 'p4',
    examples: [
      {
        title: 'גלידה מתוקה',
        description: 'הלשון מזהה מיד את המתיקות והקרירות של הקינוח.',
        imageUrls: [
          'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        title: 'לימון חמוץ',
        description: 'בלוטות הטעם מתכווצות כשאנחנו טועמים משהו חמוץ במיוחד.',
        imageUrls: [
          'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1604177090364-7933902f542c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590505660191-10499e62310b?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: SenseId.TOUCH,
    name: 'מגע',
    organ: 'עור (ידיים)',
    description: 'חוש המגע פזור על כל העור שלנו ומאפשר לנו להרגיש מרקם, טמפרטורה וכאב.',
    color: 'bg-green-500',
    icon: '✋',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80',
    printableId: 'p3',
    examples: [
      {
        title: 'ליטוף חיה רכה',
        description: 'אנחנו מרגישים את הפרווה הנעימה והרכה של החתול או הכלב.',
        imageUrls: [
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513245533132-aa7fbd0af13b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1573865667245-04248f578c1c?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        title: 'מים חמים או קרים',
        description: 'העור מעביר לנו מידע חשוב על טמפרטורת המים באמבטיה.',
        imageUrls: [
          'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1500353391640-d784a0d1656c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1559839734-2b71f158b818?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: 'דנה יצאה לטיול והבחינה בפרפר צבעוני עף בשמיים. באיזה חוש היא השתמשה בעיקר?',
    correctSenseId: SenseId.SIGHT,
    options: [
      { id: SenseId.SIGHT, label: 'ראייה' },
      { id: SenseId.HEARING, label: 'שמיעה' },
      { id: SenseId.TASTE, label: 'טעם' }
    ]
  },
  {
    id: 2,
    scenario: 'יונתן נגע בסיר חם על הכיריים והרגיש מיד שעליו להזיז את היד. איזה חוש הציל אותו?',
    correctSenseId: SenseId.TOUCH,
    options: [
      { id: SenseId.SMELL, label: 'ריח' },
      { id: SenseId.TOUCH, label: 'מגע' },
      { id: SenseId.SIGHT, label: 'ראייה' }
    ]
  },
  {
    id: 3,
    scenario: 'אמא מכינה עוגה במטבח והריח הגיע עד לחדר של רוני. באיזה חוש השתמשה רוני?',
    correctSenseId: SenseId.SMELL,
    options: [
      { id: SenseId.HEARING, label: 'שמיעה' },
      { id: SenseId.TASTE, label: 'טעם' },
      { id: SenseId.SMELL, label: 'ריח' }
    ]
  },
  {
    id: 4,
    scenario: 'בזמן נהיגה בלילה, הנהג רואה שהרמזור מתחלף לאדום. איזה חוש מאפשר לו לראות זאת?',
    correctSenseId: SenseId.SIGHT,
    options: [
      { id: SenseId.SIGHT, label: 'ראייה' },
      { id: SenseId.TOUCH, label: 'מגע' },
      { id: SenseId.SMELL, label: 'ריח' }
    ]
  }
];
