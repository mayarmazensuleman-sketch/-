import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft, BookMarked, BookOpen, Briefcase, CalendarDays, Check,
  CheckCircle2, ChevronLeft, CircleHelp, ClipboardCheck, Coins,
  ExternalLink, FileText, GraduationCap, HandCoins, Home, Landmark,
  Layers3, Library, ListFilter, Menu, RotateCcw, Scale, ScrollText,
  Search, ShieldCheck, Sparkles, Target, Timer, Users, X,
} from 'lucide-react'
import './styles.css'

type Category = 'مدخل' | 'ملكية' | 'منفعة' | 'عمل' | 'مشاركة' | 'ضمان'
type View = 'home' | 'map' | 'outcomes' | 'methods' | 'irac' | 'assessment' | 'laws' | 'precedents' | 'sources'

type Topic = {
  id: string
  title: string
  short: string
  category: Category
  definition: string
  pillars: string[]
  example: string
  insight: string
  article?: string
  systemText?: string
  elements?: string[]
  effects?: string[]
  articles?: string[]
  question: string
  options: string[]
  answer: number
  feedback: string
}

type LegalArticle = {
  id: number
  number: number
  reference: string
  text: string
  source: string
  sourceUrl: string
  explanationStatus: string
  topicId: string | null
  hasExplanation: boolean
  explanation?: ExplanationEntry
}

type ExplanationEntry = {
  articleNumber: number
  part: number
  partTitle: string
  pdfPage: number
  sourceFile: string
  excerpt: string
  citation: string
}

type Unit = {
  id: number
  index: string
  title: string
  category: Category
  description: string
  duration: string
  icon: typeof BookOpen
  topics: Topic[]
}

const officialSource = 'https://laws.boe.gov.sa/BoeLaws/Laws/LawDetails/655fdb42-8c96-422b-b8c4-b04f0095c94c/1'
const bookSource = '/assets/contract-book.pdf'

const units: Unit[] = [
  {
    id: 1, index: '01', title: 'مدخل إلى العقود المدنية', category: 'مدخل', duration: 'أسبوع 01', icon: BookOpen,
    description: 'نضع المفاهيم في مكانها: ما العقد؟ وما الذي يميّز العقد المسمى عن غير المسمى؟',
    topics: [
      {
        id: 'contract-concept', title: 'مفهوم العقد', short: 'العقد توافق إرادتين أو أكثر على إحداث أثر نظامي.', category: 'مدخل',
        definition: 'العقد رابطة نظامية تنشأ من توافق إرادتين أو أكثر على إنشاء التزام أو نقله أو تعديله أو إنهائه، وتقوم فكرته على التراضي ووضوح محل الالتزام ومشروعيته.',
        pillars: ['التراضي وتطابق الإرادتين', 'محل ممكن ومحدد أو قابل للتحديد', 'سبب مشروع وعدم مخالفة النظام العام'],
        example: 'اتفقت طالبة مع مكتبة على إعداد نسخة مجلدة من بحثها بمقابل معلوم وموعد تسليم محدد؛ هنا نشأت التزامات متبادلة يمكن قياس تنفيذها.',
        insight: 'اسألي دائماً: ماذا أراد الطرفان؟ ما محل الالتزام؟ وما الأثر الذي رتبه النظام على هذا الاتفاق؟',
        article: 'القسم الأول من نظام المعاملات المدنية يقرر القواعد العامة للعقد وآثاره قبل الانتقال إلى العقود المسماة.',
        systemText: 'يُستكمل فهم العقد من خلال القواعد العامة في نظام المعاملات المدنية، ثم تُقرأ الأحكام الخاصة بكل عقد في القسم الثاني.',
        question: 'أي عبارة تعبّر عن وظيفة العقد؟', options: ['إحداث أثر نظامي بناءً على توافق الإرادات', 'إعلان رغبة منفردة لا ترتب أي أثر', 'واقعة مادية لا صلة لها بالإرادة'], answer: 0,
        feedback: 'صحيح. جوهر العقد هو توافق الإرادات على أثر نظامي، لا مجرد رغبة منفردة.'
      },
      {
        id: 'named-unnamed', title: 'العقود المسماة وغير المسماة', short: 'التسمية تعكس وجود تنظيم خاص، لا تفاضلاً في القوة.', category: 'مدخل',
        definition: 'العقد المسمى هو الذي خصّه النظام باسم وأحكام تفصيلية، كالبيع والإيجار والوكالة. أما غير المسمى فلم يفرد له النظام اسماً مستقلاً، ويخضع للقواعد العامة ولما اتفق عليه الطرفان ما دام مشروعاً.',
        pillars: ['وجود اسم وتنظيم خاص', 'الرجوع إلى القواعد العامة عند النقص', 'احترام حرية التعاقد في حدود النظام'],
        example: 'عقد إدارة حسابات متجر إلكتروني قد يجمع خصائص الوكالة والعمل، فيُكيّف بحسب الغرض الغالب والالتزامات الفعلية.',
        insight: 'التكييف القانوني لا يتوقف على العنوان الذي يكتبه الطرفان؛ العبرة بحقيقة الالتزامات ومحلها.',
        article: 'في العقود غير المسماة، تُستدعى القواعد العامة ثم أقرب العقود المسماة عند الحاجة إلى تفسير الالتزام.',
        question: 'ما المعيار الأهم في تكييف العقد؟', options: ['عنوان العقد فقط', 'حقيقة الالتزامات والغرض منها', 'قيمة المقابل وحدها'], answer: 1,
        feedback: 'صحيح. العبرة بحقيقة الالتزامات والغرض الاقتصادي والقانوني للعقد، لا بالعنوان وحده.'
      },
    ],
  },
  {
    id: 2, index: '02', title: 'العقود الواردة على الملكية', category: 'ملكية', duration: 'أسبوعان 02–03', icon: Landmark,
    description: 'نقرأ انتقال الملكية ومقابله: من البيع والمقايضة إلى الهبة والقرض والصلح والمسابقة.',
    topics: [
      {
        id: 'sale', title: 'عقد البيع', short: 'تمليك المبيع للمشتري مقابل ثمن نقدي.', category: 'ملكية',
        definition: 'البيع عقد يُمَلِّك بمقتضاه البائع المبيع للمشتري مقابل ثمن نقدي. ويقوم عملياً على تحديد المبيع والثمن والتزامات التسليم والوفاء والضمان.',
        pillars: ['مبيع معلوم برؤية أو بصفات مميزة', 'ثمن نقدي معلوم أو قابل للتعيين', 'تسليم المبيع والوفاء بالثمن'],
        elements: ['التراضي: توافق البائع والمشتري على البيع.', 'المبيع: مال معلوم ومشروع وقابل للتسليم.', 'الثمن: مقابل نقدي معلوم أو قابل للتعيين.', 'الأهلية: صلاحية الطرفين لإبرام التصرف.'],
        effects: ['نقل ملكية المبيع إلى المشتري في الأصل بمجرد انعقاد البيع، مع مراعاة القيود النظامية.', 'التزام البائع بتسليم المبيع والقيام بما يلزم لنقل الملكية.', 'التزام المشتري بدفع الثمن وتسلم المبيع.', 'ضمان البائع للتعرض والاستحقاق والعيوب وفق شروط النظام.'],
        articles: ['المادة 307: تعريف عقد البيع.', 'المادة 318: الأصل في البيع انتقال الملكية بمجرد انعقاد العقد.', 'المادتان 319 و321: التزامات البائع وآثار البيع.', 'المواد 338 و339 و340 و343: ضمان العيب وآثاره.', 'المواد 655 و656 و657: قيود انتقال ملكية المبيع.'],
        example: 'اشترت سارة جهازاً موصوفاً في الفاتورة، واتفق الطرفان على التسليم خلال ثلاثة أيام؛ يثور عند النزاع بحث العلم بالمبيع ومطابقته للصفة.',
        insight: 'ابدئي من المادة 307: تعريف موجز، ثم انتقلي إلى المواد اللاحقة لفهم العلم بالمبيع والتجربة والتسليم والضمان.',
        article: 'المادة السابعة بعد الثلاثمائة',
        systemText: '«البيع عقد يُمَلِّكُ بمقتضاه البائع المبيع للمشتري مقابل ثمنٍ نقدي.»',
        question: 'ما المقابل المميز في تعريف البيع نظاماً؟', options: ['عمل شخصي بلا مقابل', 'ثمن نقدي', 'تسليم شيء مماثل'], answer: 1,
        feedback: 'صحيح. نظام المعاملات المدنية يربط البيع بتمليك المبيع مقابل ثمن نقدي.'
      },
      {
        id: 'barter', title: 'عقد المقايضة', short: 'تبادل مال بمال دون أن يكون الثمن نقدياً أصلاً.', category: 'ملكية',
        definition: 'المقايضة تبادل مال بمال؛ فيكون كل طرف بائعاً لما يقدمه ومشترياً لما يأخذه، مع مراعاة طبيعة المال والالتزامات الخاصة بالتسليم والضمان.',
        pillars: ['مالان أو محلّان قابلان للتبادل', 'تراضي الطرفين على المبادلة', 'إمكان التسليم وتعيين المحل'],
        example: 'اتفق شخصان على مبادلة سيارة بدراجة نارية مع دفع فرق محدد؛ تظل حقيقة العقد مبادلة لا بيعاً نقدياً خالصاً.',
        insight: 'اسألي: هل النقد هو المقابل الأصلي أم أن المال يقابل مالاً؟ هذا يوجّه التكييف.',
        question: 'ما الذي يميز المقايضة عن البيع؟', options: ['المقابل الأصلي مال آخر', 'وجود ثمن نقدي دائماً', 'عدم انتقال الملكية'], answer: 0,
        feedback: 'صحيح. في المقايضة يكون المال مقابلاً لمال آخر، وليس ثمنًا نقديًا أصلياً.'
      },
      {
        id: 'gift', title: 'عقد الهبة', short: 'تمليك مال أو حق للغير بلا عوض أثناء الحياة.', category: 'ملكية',
        definition: 'الهبة تمليك مال أو حق مالي للموهوب له في حياة الواهب بلا عوض، وتُبحث فيها أهلية الواهب وقبول الموهوب له والقبض أو الشكل الذي يتطلبه محل الهبة.',
        pillars: ['نية التبرع', 'مال أو حق قابل للتمليك', 'قبول وقبض بحسب المحل والنظام'],
        example: 'وهب أب لابنته مبلغاً وحوّله إلى حسابها وقبلت به؛ ندرس القصد المجاني والقبول والقبض وأثرهما.',
        insight: 'لا تخلطي بين الهبة والعارية: الهبة تنقل الملكية، والعارية تمنح الانتفاع مع بقاء الأصل.',
        question: 'ما السمة المركزية للهبة؟', options: ['وجود عوض نقدي', 'التبرع بلا عوض', 'رد المال بعد مدة'], answer: 1,
        feedback: 'صحيح. الهبة تقوم على التمليك المجاني، بينما العارية تمنح الانتفاع دون نقل الملكية.'
      },
      {
        id: 'loan', title: 'عقد القرض', short: 'تمليك مال مثلي على أن يرد مثله.', category: 'ملكية',
        definition: 'القرض يرد على مال مثلي يستهلك بالاستعمال، فينتقل مثله إلى المقترض ويلتزم برد المثل عند حلول الأجل، وتُفهم آثاره من طبيعة المال وشروط الوفاء.',
        pillars: ['مال مثلي قابل للاستهلاك', 'انتقال المال للمقترض', 'رد المثل عند الاستحقاق'],
        example: 'أقرضت مها زميلتها ألف ريال إلى نهاية الشهر؛ محل الالتزام رد ألف ريال لا الأوراق ذاتها.',
        insight: 'المعيار الفاصل عن العارية هو أن القرض يرد على مال يُستهلك ويرد مثله، أما العارية فيرد فيها العين ذاتها.',
        question: 'ماذا يرد المقترض في الأصل؟', options: ['العين ذاتها دائماً', 'مثلاً مماثلاً للمال', 'خدمة بديلة'], answer: 1,
        feedback: 'صحيح. القرض ينقل مالاً مثلياً ويرد المقترض مثله عند الاستحقاق.'
      },
      {
        id: 'settlement', title: 'عقد الصلح', short: 'حسم نزاع أو توقي نزاع محتمل باتفاق الطرفين.', category: 'ملكية',
        definition: 'الصلح اتفاق يحسم به الطرفان نزاعاً قائماً أو يتوقيان به نزاعاً محتملاً، وقد يتضمن تنازل كل طرف عن جزء من ادعائه مقابل إنهاء الخصومة.',
        pillars: ['نزاع قائم أو محتمل', 'تنازلات متبادلة أو ترتيب حاسم', 'محل مشروع وواضح'],
        example: 'اتفق مؤجر ومستأجر على مبلغ نهائي عن أضرار محل النزاع بدلاً من الاستمرار في المطالبة؛ الأثر هو إغلاق باب الخصومة في حدود الاتفاق.',
        insight: 'ركزي على وظيفة الصلح: ليس مجرد إقرار بالحق، بل وسيلة لإنهاء النزاع أو الوقاية منه.',
        question: 'ما الغاية العملية الأبرز من الصلح؟', options: ['بدء نزاع جديد', 'حسم نزاع أو توقيه', 'نقل الحيازة بلا اتفاق'], answer: 1,
        feedback: 'صحيح. الصلح أداة توافقية لإنهاء نزاع قائم أو منع نزاع متوقع.'
      },
      {
        id: 'competition', title: 'عقد المسابقة', short: 'التزام بجائزة أو عوض لمن يحقق نتيجة معلومة.', category: 'ملكية',
        definition: 'المسابقة اتفاق يحدد عملاً أو نتيجة ومعايير استحقاق جائزة أو عوض، ويظهر فيها عنصر التنافس مع ضرورة وضوح شروط المشاركة والاستحقاق.',
        pillars: ['نتيجة أو عمل محدد', 'شروط معلنة أو متفق عليها', 'جائزة واستحقاق قابل للتحقق'],
        example: 'أعلنت جهة جائزة لأفضل بحث وفق معايير منشورة وموعد تسليم محدد؛ يثور بحث شروط المسابقة وتحقق النتيجة.',
        insight: 'حللي المسابقة كعقد ذي أداء محتمل: لا يكفي الوعد بالجائزة بل يجب فهم شرط الاستحقاق.',
        question: 'متى ترتبط الجائزة في المسابقة؟', options: ['عند تحقق النتيجة وفق الشروط', 'بمجرد قراءة الإعلان دائماً', 'دون أي معيار'], answer: 0,
        feedback: 'صحيح. الاستحقاق يتصل بتحقق النتيجة أو العمل وفق شروط المسابقة.'
      },
    ],
  },
  {
    id: 3, index: '03', title: 'العقود الواردة على المنفعة', category: 'منفعة', duration: 'أسبوع 04', icon: Home,
    description: 'نميّز بين الانتفاع بعوض في الإيجار والانتفاع المجاني المؤقت في الإعارة.',
    topics: [
      {
        id: 'lease', title: 'عقد الإيجار', short: 'تمكين المستأجر من الانتفاع بمأجور مدة معينة مقابل أجرة.', category: 'منفعة',
        definition: 'الإيجار عقد يمكّن المؤجر بمقتضاه المستأجر من الانتفاع بالمأجور مدة معينة مقابل أجرة. ويظهر في تحديد المنفعة والمدة والأجرة والتزامات المحافظة والرد.',
        pillars: ['مأجور صالح للانتفاع', 'منفعة ومدة معلومتان', 'أجرة والتزامات متبادلة'],
        example: 'استأجرت نورة شقة لمدة سنة بأجرة شهرية؛ عند النزاع نفحص التسليم، حدود الاستعمال، الصيانة، ورد المأجور.',
        insight: 'المادة 431 تذكّر بحدود الاستعمال: ما اتفق عليه الطرفان، وإلا فبحسب ما أُعدّ له المأجور.',
        article: 'المادة الحادية والثلاثون بعد الأربعمائة',
        systemText: '«يلتزم المستأجر باستعمال المأجور في حدود المنفعة المتفق عليها في العقد، فإن لم يكن هناك اتفاقٌ التزم باستعمالهِ بحسب ما أُعد له.»',
        question: 'كيف يحدد استعمال المأجور عند غياب الاتفاق؟', options: ['بحسب ما أُعدّ له المأجور', 'بحسب رغبة المؤجر بعد العقد', 'بأي استعمال ولو أضر به'], answer: 0,
        feedback: 'صحيح. عند غياب الاتفاق يُستعمل المأجور بحسب الغرض الذي أُعدّ له.'
      },
      {
        id: 'loan-use', title: 'عقد الإعارة', short: 'تمكين الغير من الانتفاع بالعين مجاناً مع ردها.', category: 'منفعة',
        definition: 'الإعارة تمكين الغير من الانتفاع بعين معينة مجاناً مدة أو لغرض، على أن يرد المستعير العين ذاتها بعد انتهاء الانتفاع، مع التزامه بالمحافظة عليها.',
        pillars: ['عين معينة قابلة للرد', 'انتفاع بلا عوض', 'رد العين بعد انتهاء الغرض'],
        example: 'أعارت طالبة زميلتها جهاز العرض ليوم واحد؛ لا تنتقل الملكية، ويلزم رد الجهاز بذاته والمحافظة عليه.',
        insight: 'قارنيها بالقرض: العارية ترد فيها العين ذاتها، والقرض يرد فيه المثل.',
        question: 'ما الالتزام الجوهري للمستعير؟', options: ['رد مثل العين فقط', 'رد العين ذاتها والمحافظة عليها', 'بيع العين للغير'], answer: 1,
        feedback: 'صحيح. العارية تنتفع فيها بالعين مع بقاء ملكيتها وردها بذاتها.'
      },
    ],
  },
  {
    id: 4, index: '04', title: 'العقود الواردة على العمل', category: 'عمل', duration: 'أسبوعان 05–06', icon: Briefcase,
    description: 'نحلل بذل العمل: النتيجة في المقاولة، التبعية في العمل، والنيابة في الوكالة، مع الحفظ والحراسة.',
    topics: [
      {
        id: 'contracting', title: 'عقد المقاولة', short: 'إنجاز عمل أو صنع شيء مقابل عوض دون تبعية تنظيمية.', category: 'عمل',
        definition: 'المقاولة عقد يلتزم فيه المقاول بصنع شيء أو أداء عمل لقاء عوض، مع استقلاله في تنظيم التنفيذ بحسب الاتفاق وطبيعة العمل، ما لم يرد شرط مخالف.',
        pillars: ['عمل أو نتيجة محددة', 'عوض معلوم أو قابل للتعيين', 'استقلال المقاول في التنفيذ غالباً'],
        example: 'تعاقدت أسرة مع مقاول لترميم المنزل وفق مخطط ومدة ومقابل؛ المدار على إنجاز النتيجة والمواصفات المتفق عليها.',
        insight: 'حددي هل المطلوب نتيجة محددة أم مجرد بذل عمل تحت إدارة الطرف الآخر؛ هذا يساعد على التمييز عن عقد العمل.',
        question: 'ما العنصر الذي يبرز عادة في المقاولة؟', options: ['تحقق عمل أو نتيجة متفق عليها', 'تبعـية وظيفية دائمة فقط', 'انتقال ملكية عقار'], answer: 0,
        feedback: 'صحيح. المقاولة تدور غالباً حول إنجاز عمل أو نتيجة مقابل عوض.'
      },
      {
        id: 'employment', title: 'عقد العمل', short: 'عمل لمصلحة صاحب العمل وتحت إدارته أو إشرافه مقابل أجر.', category: 'عمل',
        definition: 'عقد العمل يقوم على أداء العامل عملاً لمصلحة صاحب العمل وتحت إدارته أو إشرافه مقابل أجر، ويبرز فيه عنصر التبعية والالتزام بالحضور والأداء وفق التنظيم.',
        pillars: ['عمل شخصي', 'أجر', 'تبعية وإشراف أو إدارة'],
        example: 'تعمل ريم في شركة وفق ساعات وتعليمات ومدير مباشر مقابل راتب شهري؛ عنصر التبعية يميّز العلاقة عن المقاولة المستقلة.',
        insight: 'لا يكفي أن يسمى العقد «استشارة» أو «مقاولة»؛ افحصي واقع الإشراف والدوام وطريقة الأداء.',
        question: 'ما العنصر الفارق غالباً في عقد العمل؟', options: ['التبعية والإشراف', 'رد عين معارة', 'تبادل مال بمال'], answer: 0,
        feedback: 'صحيح. التبعية التنظيمية والإشراف من أهم مؤشرات عقد العمل.'
      },
      {
        id: 'agency', title: 'عقد الوكالة', short: 'إقامة الوكيل مقام الموكل في تصرف نظامي.', category: 'عمل',
        definition: 'الوكالة عقد يقيم فيه الموكل الوكيل مقامه في تصرف نظامي، فيعمل الوكيل في حدود السلطة الممنوحة وبما يحقق مصلحة الموكل، مع التزامه بالإفصاح والحساب بحسب الحال.',
        pillars: ['تصرف نظامي قابل للنيابة', 'سلطة وحدود وكالة', 'مصلحة الموكل وحسن التنفيذ'],
        example: 'فوّض مالك عقاره وكيلاً في إبرام عقد إيجار بشروط محددة؛ لا يتجاوز الوكيل حدود التفويض إلا بإجازة أو سند.',
        insight: 'اقرئي الوكالة من زاوية السلطة: ماذا أُذن للوكيل أن يفعل؟ ولمن ينصرف أثر التصرف؟',
        question: 'ما محور تحليل الوكالة؟', options: ['حدود السلطة الممنوحة', 'ثمن نقدي فقط', 'انتفاع مجاني بالعين'], answer: 0,
        feedback: 'صحيح. فهم نطاق السلطة وحدودها مفتاح تكييف آثار الوكالة.'
      },
      {
        id: 'deposit', title: 'عقد الإيداع', short: 'تسلّم منقول لحفظه ثم رده عيناً.', category: 'عمل',
        definition: 'الإيداع عقد يتسلم فيه المودَع لديه مالاً منقولاً لحفظه ورده عيناً، ويقوم جوهره على الحيازة لمصلحة المودع لا على تملك المال أو استعماله.',
        pillars: ['منقول قابل للحفظ والرد', 'قصد الحفظ', 'رد العين عند الطلب أو الأجل'],
        example: 'سلّمت طالبة حاسوبها لمركز حفظ الأمانات خلال الاختبار؛ لا يملك المركز استعماله ويلزمه رده.',
        insight: 'التسليم في الإيداع لا يعني نقل الملكية؛ اسألي عن سبب الحيازة وحدود الاستعمال.',
        question: 'ما الغرض الأصلي من الإيداع؟', options: ['الحفظ والرد', 'تملك المال', 'استعمال المال لمصلحة المودَع لديه'], answer: 0,
        feedback: 'صحيح. الإيداع يقوم على الحفظ والرد، لا على التملك أو الاستعمال.'
      },
      {
        id: 'guardianship', title: 'عقد الحراسة', short: 'حفظ مال متنازع عليه وإدارته لحين ثبوت الحق.', category: 'عمل',
        definition: 'الحراسة وضع مال متنازع عليه أو خيف عليه تحت يد حارس يتولى حفظه وإدارته ورده لمن يثبت له الحق، وفق حدود المهمة والقرار المنشئ لها.',
        pillars: ['مال محل نزاع أو خطر', 'حارس محايد قدر الإمكان', 'حفظ وإدارة ثم رد مستحق'],
        example: 'عيّنت الجهة المختصة حارساً على متجر متنازع على ملكيته ليستمر تشغيله وحفظ إيراده حتى يحسم النزاع.',
        insight: 'الحراسة إجراء وقائي لإدارة المال أثناء النزاع، وليست طريقاً لحسم الملكية ذاتها.',
        question: 'إلى من يرد المال عند انتهاء الحراسة؟', options: ['لمن يثبت له الحق', 'للحارس دائماً', 'لأي شخص يطلبه'], answer: 0,
        feedback: 'صحيح. الحارس يحفظ ويدير، ثم يرد المال لمن يثبت له الحق.'
      },
    ],
  },
  {
    id: 5, index: '05', title: 'عقود المشاركة', category: 'مشاركة', duration: 'أسبوع 07', icon: Users,
    description: 'نفهم اجتماع الجهود أو الأموال لتحقيق غرض مشترك وتوزيع الناتج وفق الاتفاق والنظام.',
    topics: [
      {
        id: 'company', title: 'عقد الشركة', short: 'مساهمة شريكين أو أكثر في مشروع واقتسام الربح والخسارة.', category: 'مشاركة',
        definition: 'الشركة اتفاق يساهم بمقتضاه شخصان أو أكثر في مشروع باقتسام ما ينشأ عنه من ربح أو خسارة، مع تحديد الحصص والإدارة والمسؤولية بحسب نوع الشركة.',
        pillars: ['تعدد الشركاء', 'مساهمة بحصة أو عمل', 'غرض مشترك واقتسام الناتج'],
        example: 'أسست طالبتان مشروعاً لبيع المنتجات الرقمية، قدمت إحداهما التمويل والأخرى العمل، واتفقتا على نسبة التوزيع.',
        insight: 'حللي الشركة بثلاثة أسئلة: ما الحصص؟ من يدير؟ وكيف يوزع الربح ويتحمل الخطر؟',
        question: 'ما الفكرة المشتركة في الشركة؟', options: ['مشروع مشترك واقتسام الناتج', 'حفظ مال الغير', 'انتفاع مجاني بعين'], answer: 0,
        feedback: 'صحيح. الشركة تجمع مساهمات لتحقيق مشروع واقتسام ربحه أو خسارته.'
      },
      {
        id: 'mudaraba', title: 'عقد المضاربة', short: 'مال من طرف وعمل من طرف والربح بحسب الاتفاق.', category: 'مشاركة',
        definition: 'المضاربة مشاركة يقدم فيها أحد الطرفين المال، ويقدم الآخر العمل والخبرة، ويكون الربح بنسبة شائعة متفق عليها، بينما ترتبط الخسارة المالية برأس المال ما لم يوجد تعدّ أو تفريط.',
        pillars: ['رأس مال من رب المال', 'عمل وإدارة من المضارب', 'ربح بنسبة شائعة'],
        example: 'قدمت ميار رأس المال لإطلاق متجر، وتولى شريكها الإدارة والتسويق، واتفقا على نسبة من الربح لا مبلغ مقطوع.',
        insight: 'الربح في المضاربة نسبة شائعة من الناتج، لا مبلغ مضمون مستقل عن النتيجة.',
        question: 'كيف يحدد ربح المضاربة؟', options: ['بنسبة شائعة من الربح', 'بمبلغ مضمون مهما كانت النتيجة', 'بملكية العقار'], answer: 0,
        feedback: 'صحيح. الربح يحدد بنسبة شائعة من الربح المتحقق، لا بمبلغ مقطوع مضمون.'
      },
      {
        id: 'output-share', title: 'المشاركة في الناتج', short: 'اتفاق على المشاركة في ناتج عمل أو مشروع محدد.', category: 'مشاركة',
        definition: 'المشاركة في الناتج تركز على توزيع ما ينتج عن عمل أو مشروع بحسب ما اتفق عليه الأطراف، مع ضبط آلية الحساب وتوقيت الاستحقاق ومخاطر النقص أو الهلاك.',
        pillars: ['ناتج قابل للقياس', 'نسب توزيع واضحة', 'اتفاق على المصروفات والمخاطر'],
        example: 'اتفق مصور ومصممة على إنتاج دورة رقمية واقتسام صافي الإيراد بنسبة محددة بعد خصم تكاليف المنصة.',
        insight: 'اكتبي في التحليل: ما المقصود بالناتج؟ هل هو إجمالي الإيراد أم الصافي؟ ومتى يستحق؟',
        question: 'ما الذي يحتاج ضبطاً في عقد المشاركة في الناتج؟', options: ['تعريف الناتج وآلية حسابه', 'إلغاء كل معيار', 'الانتقال التلقائي للملكية'], answer: 0,
        feedback: 'صحيح. تحديد الناتج وطريقة احتسابه يمنع النزاع حول الاستحقاق.'
      },
    ],
  },
  {
    id: 6, index: '06', title: 'الكفالة والتأمين', category: 'ضمان', duration: 'أسبوع 08', icon: ShieldCheck,
    description: 'نختم بضمان الوفاء والاحتياط من الخطر، مع التمييز بين الضمان الشخصي ونقل الخطر.',
    topics: [
      {
        id: 'guarantee', title: 'عقد الكفالة', short: 'ضم ذمة الكفيل إلى ذمة المدين في الوفاء بالدين.', category: 'ضمان',
        definition: 'الكفالة التزام شخص بضمان الوفاء بالتزام على المدين إذا لم يفِ به، فتضيف ذمة الكفيل ضماناً إلى ذمة المدين في الحدود التي يقررها العقد والنظام.',
        pillars: ['التزام أصلي صحيح', 'كفيل ملتزم بالضمان', 'تحديد نطاق الكفالة'],
        example: 'كفلت والدة ابنتها في عقد إيجار، فصار للمؤجر ضمان إضافي عند عدم الوفاء في حدود الكفالة.',
        insight: 'الكفالة ضمان شخصي تابع لالتزام أصلي؛ افحصي الدين الأصلي ثم مدى التزام الكفيل.',
        question: 'ما وظيفة الكفالة؟', options: ['إضافة ذمة ضامنة للوفاء', 'نقل ملكية المبيع', 'منح انتفاع مجاني'], answer: 0,
        feedback: 'صحيح. الكفالة تضيف ذمة الكفيل ضماناً للالتزام الأصلي.'
      },
      {
        id: 'insurance', title: 'عقد التأمين', short: 'تغطية خطر محتمل مقابل قسط.', category: 'ضمان',
        definition: 'التأمين ترتيب يتعهد فيه المؤمن بتعويض أو أداء عند تحقق خطر مؤمن منه، مقابل قسط يؤديه المؤمن له، ويقوم على تحديد الخطر والمدة والقسط والاستثناءات.',
        pillars: ['خطر محتمل محدد', 'قسط', 'أداء عند تحقق الخطر وفق الوثيقة'],
        example: 'أمنت شركة على مستودع ضد الحريق لمدة سنة بقسط معلوم؛ يُبحث نطاق التغطية والاستثناءات وإثبات تحقق الخطر.',
        insight: 'اقرئي وثيقة التأمين كخريطة خطر: ما المشمول؟ ما المستثنى؟ وما الإجراء عند وقوع الحادث؟',
        question: 'متى ينشأ أداء المؤمن في الأصل؟', options: ['عند تحقق الخطر المشمول وفق الوثيقة', 'بمجرد دفع أي مبلغ دون خطر', 'عند انتهاء الوثيقة دائماً'], answer: 0,
        feedback: 'صحيح. الأداء يرتبط بتحقق الخطر المؤمن منه ضمن نطاق الوثيقة.'
      },
    ],
  },
]

const navItems: { id: View; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'نظرة عامة', icon: Home },
  { id: 'map', label: 'خريطة الوحدات', icon: Layers3 },
  { id: 'outcomes', label: 'نواتج التعلم', icon: Target },
  { id: 'methods', label: 'التدريس والتقييم', icon: ClipboardCheck },
  { id: 'irac', label: 'مختبر IRAC', icon: Scale },
  { id: 'assessment', label: 'اختبري فهمك', icon: CircleHelp },
  { id: 'laws', label: 'البحث في المواد', icon: Scale },
  { id: 'precedents', label: 'السوابق والتطبيقات', icon: Briefcase },
  { id: 'sources', label: 'المصادر والكتاب', icon: BookMarked },
]

const categories: ('الكل' | Category)[] = ['الكل', 'مدخل', 'ملكية', 'منفعة', 'عمل', 'مشاركة', 'ضمان']
const allTopics = units.flatMap(unit => unit.topics)

function loadJson<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || '') as T } catch { return fallback }
}

function App() {
  const [activeView, setActiveView] = useState<View>('home')
  const [selectedTopicId, setSelectedTopicId] = useState('sale')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'الكل' | Category>('الكل')
  const [completed, setCompleted] = useState<string[]>(() => loadJson('law2504-completed', []))
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>(() => loadJson('law2504-answers', {}))
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>(() => loadJson('law2504-submitted', {}))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => { localStorage.setItem('law2504-completed', JSON.stringify(completed)) }, [completed])
  useEffect(() => { localStorage.setItem('law2504-answers', JSON.stringify(quizAnswers)) }, [quizAnswers])
  useEffect(() => { localStorage.setItem('law2504-submitted', JSON.stringify(quizSubmitted)) }, [quizSubmitted])

  const selectedTopic = allTopics.find(topic => topic.id === selectedTopicId) || allTopics[0]
  const progress = Math.round((completed.length / allTopics.length) * 100)
  const completedUnits = units.filter(unit => unit.topics.every(topic => completed.includes(topic.id))).length
  const filteredTopics = useMemo(() => allTopics.filter(topic => {
    const matchesFilter = filter === 'الكل' || topic.category === filter
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [topic.title, topic.short, topic.definition, topic.category].join(' ').toLowerCase().includes(query)
    return matchesFilter && matchesSearch
  }), [filter, search])

  const selectView = (view: View) => { setActiveView(view); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const selectTopic = (id: string) => {
    setSelectedTopicId(id)
    // عند اختيار موضوع من الصفحة الرئيسية نحافظ على موضع القراءة؛
    // ننتقل للأعلى فقط عند العودة من صفحة أخرى مثل خريطة الوحدات.
    if (activeView !== 'home') {
      setActiveView('home')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  const toggleCompleted = (id: string) => setCompleted(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
  const resetProgress = () => { setCompleted([]); setQuizAnswers({}); setQuizSubmitted({}) }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><Scale size={21} strokeWidth={1.8} /></div>
          <div>
            <div className="brand-name">مُقرر العقود المدنية</div>
            <div className="brand-kicker">LAW2504 · مراجعة قانونية</div>
          </div>
        </div>
        <div className="topbar-meta">
          <span className="uqu-pill"><Landmark size={15} /> جامعة أم القرى</span>
          <span className="year-pill">2026م / 1448هـ</span>
        </div>
        <button className="icon-button mobile-menu-button" onClick={() => setMobileMenuOpen(value => !value)} aria-label="فتح القائمة">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <div className="workspace">
        <aside className={`sidebar ${mobileMenuOpen ? 'is-open' : ''}`}>
          <div className="sidebar-profile">
            <img src="/assets/uqu-cjsr-logo.jpg" alt="شعار جامعة أم القرى وكلية الدراسات القضائية والأنظمة" />
            <div>
              <strong>العقود المدنية</strong>
              <span>كلية الدراسات القضائية والأنظمة</span>
              <small className="platform-founder">مؤسسة المنصة: ميار مازن سليمان</small>
            </div>
          </div>
          <div className="nav-label">مساحة المقرر</div>
          <nav className="side-nav" aria-label="التنقل الرئيسي">
            {navItems.map(item => {
              const Icon = item.icon
              return <button key={item.id} className={`nav-item ${activeView === item.id ? 'active' : ''}`} onClick={() => selectView(item.id)}>
                <Icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{activeView === item.id && <ChevronLeft size={16} className="nav-arrow" />}
              </button>
            })}
          </nav>
          <div className="sidebar-bottom">
            <div className="progress-card">
              <div className="progress-card-head"><span>رحلة التقدم</span><strong aria-live="polite">{progress}%</strong></div>
              <ProgressBalance progress={progress} />
              <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
              <small>{completedUnits} من {units.length} وحدات مكتملة</small>
            </div>
            <div className="author-note"><span className="author-dot" /> <span>مؤسسة المنصة</span> <strong>ميار مازن سليمان</strong></div>
          </div>
        </aside>

        <main className="main-content">
          <div className="content-width">
            {activeView === 'home' && <HomeView progress={progress} completed={completed} units={units} selectedTopic={selectedTopic} onSelectTopic={selectTopic} onToggleCompleted={toggleCompleted} filteredTopics={filteredTopics} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} onViewMap={() => selectView('map')} onViewMethods={() => selectView('methods')} />}
            {activeView === 'map' && <MapView units={units} completed={completed} onSelectTopic={selectTopic} onToggleCompleted={toggleCompleted} />}
            {activeView === 'outcomes' && <OutcomesView />}
            {activeView === 'methods' && <MethodsView />}
            {activeView === 'irac' && <IRACView />}
            {activeView === 'assessment' && <AssessmentView quizAnswers={quizAnswers} quizSubmitted={quizSubmitted} setQuizAnswers={setQuizAnswers} setQuizSubmitted={setQuizSubmitted} onReset={resetProgress} />}
            {activeView === 'laws' && <LegalSearchView onSelectTopic={selectTopic} />}
            {activeView === 'precedents' && <PrecedentsView onSelectTopic={selectTopic} />}
            {activeView === 'sources' && <SourcesView />}
          </div>
          <footer className="page-footer">
            <span><strong>مؤسسة المنصة: الطالبة ميار مازن سليمان</strong> · منصة تعليمية لمقرر LAW2504</span>
            <span>إشراف د. منيرة عبدالعزيز العامر</span>
          </footer>
        </main>
      </div>
    </div>
  )
}

function ProgressBalance({ progress }: { progress: number }) {
  return <div className="progress-balance" role="img" aria-label={`ميزان رحلة التقدم ممتلئ بنسبة ${progress}%`}>
    <div className="balance-icon-layer balance-icon-empty"><Scale size={76} strokeWidth={1.15} /></div>
    <div className="balance-fill" style={{ height: `${progress}%` }} aria-hidden="true"><Scale size={76} strokeWidth={1.65} /></div>
    <div className="balance-percent">{progress}%</div>
  </div>
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-heading">
    <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>
    {action}
  </div>
}

function HomeView({ progress, completed, units, selectedTopic, onSelectTopic, onToggleCompleted, filteredTopics, search, setSearch, filter, setFilter, onViewMap, onViewMethods }: { progress: number; completed: string[]; units: Unit[]; selectedTopic: Topic; onSelectTopic: (id: string) => void; onToggleCompleted: (id: string) => void; filteredTopics: Topic[]; search: string; setSearch: (v: string) => void; filter: 'الكل' | Category; setFilter: (v: 'الكل' | Category) => void; onViewMap: () => void; onViewMethods: () => void }) {
  const [openTopicId, setOpenTopicId] = useState<string | null>(null)
  const toggleTopic = (id: string) => { onSelectTopic(id); setOpenTopicId(current => current === id ? null : id) }
  return <>
    <section className="hero-card">
      <div className="hero-copy">
        <div className="hero-overline"><span className="live-dot" /> مساحة مراجعة تفاعلية · الفصل الدراسي الحالي</div>
        <h1>افهمي العقد،<br /><em>ثم طبّقي أثره.</em></h1>
        <p>مسار بصري يقرّب لكِ العقود المدنية من الكتاب إلى نص النظام ثم إلى المسألة القانونية. ابدئي بالخريطة، واختبري فهمك في كل خطوة.</p>
        <div className="hero-actions"><button className="primary-button" onClick={onViewMap}>ابدئي من خريطة المقرر <ArrowLeft size={17} /></button><span className="hero-caption"><Sparkles size={15} /> 20 موضوعاً قابلاً للمراجعة</span></div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="seal-ring"><span>LAW</span><strong>2504</strong><small>العقود المدنية</small></div>
        <div className="hero-line line-one" /><div className="hero-line line-two" /><div className="hero-stamp">نص<br />نظامي</div>
      </div>
    </section>

    <section className="stats-row">
      <StatCard icon={<Layers3 />} label="وحدات المقرر" value={`${units.length}`} note="من المدخل إلى التأمين" />
      <StatCard icon={<ScrollText />} label="نسبة التقدم" value={`${progress}%`} note={progress ? 'أكملي من حيث توقفتِ' : 'خطوتك الأولى تبدأ الآن'} accent />
      <StatCard icon={<Timer />} label="طريقة المراجعة" value="مختصر + تطبيقي" note="تعريف · نص · مسألة" />
    </section>

    <TeachingSignature onViewMethods={onViewMethods} />

    <section className="section-block library-section">
      <div className="section-heading"><div><div className="eyebrow">مكتبة المقرر</div><h2>اختاري مدخلك إلى العقد</h2></div><span className="result-count">{filteredTopics.length} نتيجة</span></div>
      <div className="library-toolbar">
        <label className="search-field"><Search size={17} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="ابحثي عن بيع، وكالة، ضمان..." aria-label="ابحثي في موضوعات المقرر" />{search && <button onClick={() => setSearch('')} aria-label="مسح البحث"><X size={15} /></button>}</label>
        <div className="filter-row" aria-label="تصفية حسب التصنيف"><ListFilter size={16} />{categories.map(item => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
      </div>
      <div className="library-layout">
        <div className="topic-list">
          {filteredTopics.map(topic => <TopicListItem key={topic.id} topic={topic} selected={selectedTopic.id === topic.id} expanded={openTopicId === topic.id} completed={completed.includes(topic.id)} onClick={() => toggleTopic(topic.id)} />)}
          {!filteredTopics.length && <div className="empty-state"><Search size={24} /><strong>لم نعثر على موضوع مطابق</strong><span>جربي كلمة أخرى أو أزيلي التصفية.</span></div>}
        </div>
        <TopicDetail topic={selectedTopic} completed={completed.includes(selectedTopic.id)} onToggleCompleted={onToggleCompleted} />
      </div>
    </section>

    <section className="learning-path section-block">
      <div className="section-heading"><div><div className="eyebrow">مسار التقدم</div><h2>ست محطات، من المفهوم إلى الضمان</h2></div><button className="text-button" onClick={onViewMap}>عرض الخريطة كاملة <ArrowLeft size={16} /></button></div>
      <div className="path-grid">{units.map((unit, index) => <PathCard key={unit.id} unit={unit} index={index} completed={unit.topics.every(topic => completed.includes(topic.id))} onClick={() => onSelectTopic(unit.topics[0].id)} />)}</div>
    </section>
  </>
}

function TeachingSignature({ onViewMethods }: { onViewMethods: () => void }) {
  const cues = [
    { number: '01', label: 'جانب نظري', title: 'نبني القاعدة', icon: <BookOpen size={18} />, text: 'تعريف واضح، خصائص، وأركان قبل الانتقال إلى الحكم.' },
    { number: '02', label: 'اقتباس', title: 'نعود إلى النص', icon: <ScrollText size={18} />, text: 'المادة النظامية تظهر بجانب الشرح لا في نهاية الدرس فقط.' },
    { number: '03', label: 'دراسة قضية', title: 'نحلل بــ IRAC', icon: <Scale size={18} />, text: 'مسألة قانونية تمر من المسألة إلى القاعدة ثم التطبيق والنتيجة.' },
    { number: '04', label: 'نشاط وتقييم', title: 'نختبر الفهم', icon: <ClipboardCheck size={18} />, text: 'سؤال افتتاحي، تمرين فردي، ثم اختبار قصير مع تغذية راجعة.' },
  ]
  return <section className="teaching-signature section-block">
    <div className="signature-head"><div><div className="eyebrow">أسلوب المحاضرة</div><h2>تعلمي بالطريقة التي تُشرح بها المادة</h2><p>مستوحى من بنية شرائح د. منيرة: لا نبدأ بالحفظ، بل بتمييز نوع العقد وتكييفه ثم اختبار أثره على واقعة.</p></div><button className="text-button" onClick={onViewMethods}>شاهدي مسار الدرس <ArrowLeft size={16} /></button></div>
    <div className="cue-grid">{cues.map(cue => <div className="cue-card" key={cue.number}><span className="cue-number">{cue.number}</span><div className="cue-icon">{cue.icon}</div><span className="cue-label">{cue.label}</span><strong>{cue.title}</strong><p>{cue.text}</p></div>)}</div>
  </section>
}

function StatCard({ icon, label, value, note, accent = false }: { icon: React.ReactNode; label: string; value: string; note: string; accent?: boolean }) { return <div className={`stat-card ${accent ? 'accent' : ''}`}><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div> }
function TopicListItem({ topic, selected, expanded, completed, onClick }: { topic: Topic; selected: boolean; expanded: boolean; completed: boolean; onClick: () => void }) { return <div className={`topic-accordion ${expanded ? 'is-open' : ''}`}><button className={`topic-list-item ${selected ? 'selected' : ''}`} onClick={onClick} aria-expanded={expanded}><span className={`topic-dot category-${topic.category}`}>{completed ? <Check size={15} /> : <span>{topic.title.slice(0, 1)}</span>}</span><span className="topic-list-copy"><strong>{topic.title}</strong><small>{topic.short}</small></span><span className="topic-category">{topic.category}</span><ChevronLeft size={17} /></button>{expanded && <InlineTopicText topic={topic} />}</div> }
function InlineTopicText({ topic }: { topic: Topic }) {
  const elements = topic.elements || topic.pillars.map(item => `عنصر مهم: ${item}.`)
  const effects = topic.effects || [`ينشئ ${topic.title} حقوقاً والتزامات متبادلة بحسب ما اتفق عليه الطرفان وبحسب أحكام النظام.`, 'يُرجع في تحديد الأثر إلى طبيعة العقد ومحل الالتزام والوقائع المعروضة.']
  const articles = topic.articles || (topic.article ? [topic.article, 'تطبق عليه القواعد العامة للعقود في نظام المعاملات المدنية.'] : ['تطبق عليه القواعد العامة للعقود والأحكام الخاصة ذات الصلة في نظام المعاملات المدنية.'])
  return <div className="inline-topic-text full-lesson"><div className="full-lesson-title"><BookOpen size={16} /><strong>شرح موضوع {topic.title}</strong><span>درس مختصر قابل للقراءة</span></div><section className="accordion-section"><h4><span>01</span> التعريف والفكرة</h4><p>{topic.definition}</p><div className="inline-topic-example"><strong>مثال تطبيقي:</strong> {topic.example}</div></section><section className="accordion-section"><h4><span>02</span> الأركان والعناصر</h4><ul>{elements.map(element => <li key={element}>{element}</li>)}</ul></section><section className="accordion-section"><h4><span>03</span> الآثار والالتزامات</h4><ul>{effects.map(effect => <li key={effect}>{effect}</li>)}</ul></section><section className="accordion-section"><h4><span>04</span> مواد نظام المعاملات المدنية</h4><ul className="article-list">{articles.map(article => <li key={article}>{article}</li>)}</ul>{topic.systemText && <div className="inline-topic-law"><Scale size={14} /><span>{topic.systemText}</span></div>}</section><section className="accordion-question"><strong>سؤال للتفكير:</strong> {topic.question}</section><span className="inline-topic-hint">اضغطي على عنوان «{topic.title}» مرة أخرى لإغلاق الدرس</span></div>
}
function PathCard({ unit, index, completed, onClick }: { unit: Unit; index: number; completed: boolean; onClick: () => void }) { const Icon = unit.icon; return <button className={`path-card ${completed ? 'is-complete' : ''}`} onClick={onClick}><span className="path-number">{completed ? <Check size={14} /> : unit.index}</span><Icon size={20} /><strong>{unit.title}</strong><small>{unit.topics.length} موضوعات · {unit.duration}</small><span className="path-arrow"><ChevronLeft size={16} /></span></button> }

function TopicDetail({ topic, completed, onToggleCompleted }: { topic: Topic; completed: boolean; onToggleCompleted: (id: string) => void }) {
  const [answer, setAnswer] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  useEffect(() => { setAnswer(null); setSubmitted(false) }, [topic.id])
  return <article className="topic-detail">
    <div className="detail-head"><div><span className={`category-label category-${topic.category}`}>{topic.category}</span><h3>{topic.title}</h3><p>{topic.short}</p></div><button className={`complete-button ${completed ? 'done' : ''}`} onClick={() => onToggleCompleted(topic.id)}>{completed ? <><CheckCircle2 size={16} /> مكتمل</> : <><Check size={16} /> علّميه كمكتمل</>}</button></div>
    <LessonFlow topic={topic} />
    <div className="clear-explanation"><div className="explanation-kicker"><BookOpen size={16} /> أولاً: افهمي الفكرة</div><h4>{topic.short}</h4><p>{topic.definition}</p><div className="plain-takeaway"><Sparkles size={15} /><span><strong>بعبارة أبسط:</strong> {plainLanguage(topic)}</span></div></div>
    <div className="explanation-grid"><div className="example-panel"><span className="micro-label">ثانياً: مثال من الحياة</span><p>{topic.example}</p><div className="insight"><Sparkles size={15} /><span>{topic.insight}</span></div></div><div className="definition-panel"><span className="micro-label">ثالثاً: ما الذي أبحث عنه؟</span><p className="search-question">عند قراءة أي واقعة، ابحثي عن هذه العناصر:</p><div className="pillars"><div>{topic.pillars.map((pillar, index) => <span key={pillar}><b>{index + 1}</b>{pillar}</span>)}</div></div></div></div>
    {topic.systemText ? <div className="law-quote"><div className="quote-label"><Scale size={16} /> نص النظام <span>{topic.article}</span></div><blockquote>{topic.systemText}</blockquote><small>اقتباس مختار من نظام المعاملات المدنية · راجعي المصدر الرسمي للنص الكامل.</small></div> : <div className="law-note"><FileText size={18} /><div><strong>صلة بالنظام</strong><span>{topic.article || 'يُفهم هذا العقد ضمن القواعد العامة والأحكام الخاصة في القسم الثاني من النظام.'}</span></div><a href={officialSource} target="_blank" rel="noreferrer">فتح النظام <ExternalLink size={14} /></a></div>}
    <div className="check-question"><div className="question-head"><span className="question-number">01</span><div><span className="micro-label">تحققي من فهمك</span><strong>{topic.question}</strong></div></div><div className="options">{topic.options.map((option, index) => <button key={option} className={`${answer === index ? 'picked' : ''} ${submitted && index === topic.answer ? 'correct' : ''} ${submitted && answer === index && index !== topic.answer ? 'wrong' : ''}`} onClick={() => !submitted && setAnswer(index)}><span>{String.fromCharCode(0x623 + index)}</span>{option}{submitted && index === topic.answer && <Check size={16} />}</button>)}</div>{submitted && <div className={`feedback ${answer === topic.answer ? 'positive' : 'negative'}`}><CheckCircle2 size={16} />{answer === topic.answer ? topic.feedback : `الإجابة الأدق: ${topic.options[topic.answer]}. ${topic.feedback}`}</div>}<button className="check-button" disabled={answer === null} onClick={() => setSubmitted(true)}>{submitted ? 'تم التحقق' : 'تحققي من الإجابة'}<ArrowLeft size={16} /></button></div>
  </article>
}

function plainLanguage(topic: Topic) {
  const plain: Record<string, string> = {
    'contract-concept': 'ليس كل اتفاق عقداً؛ يصبح الاتفاق عقداً عندما تتوافق الإرادتان على أثر يعترف به النظام.',
    'named-unnamed': 'لا تحكمي على العقد من اسمه فقط؛ انظري إلى ما وعد به كل طرف وما يريده من الاتفاق.',
    sale: 'البائع يعطي شيئاً، والمشتري يدفع ثمناً نقدياً، وينشأ عن ذلك التزامات بالتسليم والوفاء والضمان.',
    barter: 'كل طرف يعطي مالاً ويأخذ مالاً آخر؛ لذلك لا يكون المقابل ثمناً نقدياً في الأصل.',
    gift: 'شخص يملك مالاً وينقله إلى غيره بقصد التبرع، من غير أن يأخذ مقابلاً.',
    loan: 'المقترض يستهلك المال غالباً، ثم يعيد مالاً مماثلاً له عند الموعد.',
    lease: 'المؤجر لا ينقل ملكية العين؛ بل يمنح المستأجر منفعتها مدة معينة مقابل أجرة.',
    employment: 'العامل يؤدي عملاً تحت إدارة صاحب العمل وإشرافه، وصاحب العمل يدفع الأجر.',
    agency: 'الموكل يطلب من الوكيل أن يتصرف باسمه وفي حدود الصلاحيات التي أعطاها له.',
    guarantee: 'الكفيل يضيف التزامه إلى التزام المدين حتى يضمن للدائن الوفاء بحقه.',
  }
  return plain[topic.id] || `هذا العقد ينظم علاقة بين طرفين، ويحدد ما يقدمه كل طرف وما يترتب على ذلك من حقوق والتزامات.`
}

function LessonFlow({ topic }: { topic: Topic }) {
  const opening = topic.id === 'sale' ? 'عندما تشتري الطالبة سيارة ثم يظهر عيب خفي، ما السؤال الذي ينبغي أن تسأله أولاً؟' : `لو واجهتكِ واقعة عن ${topic.title}، ما أول معلومة تحتاجينها لتكييف العقد؟`
  const issue = topic.id === 'sale' ? 'هل يثبت للمشتري حق عند ظهور عيب خفي رغم عبارة المعاينة؟' : `ما الأثر النظامي الذي يترتب على ${topic.title} في هذه الواقعة؟`
  return <div className="lesson-flow"><div className="lesson-flow-head"><span className="micro-label">مسار الدرس</span><strong>من السؤال إلى النتيجة</strong><span className="lesson-method">IRAC · قراءة تطبيقية</span></div><div className="lesson-steps"><div className="lesson-step"><span className="lesson-step-no">01</span><div><span className="lesson-step-label">سؤال افتتاحي</span><strong>{opening}</strong></div></div><div className="lesson-step"><span className="lesson-step-no">02</span><div><span className="lesson-step-label">المسألة القانونية</span><strong>{issue}</strong></div></div><div className="lesson-step"><span className="lesson-step-no">03</span><div><span className="lesson-step-label">تطبيق فردي</span><strong>استخرجي من الوقائع: الأطراف، المحل، المقابل، والالتزام الذي يحتمل الإخلال.</strong></div></div></div></div>
}

function MapView({ units, completed, onSelectTopic: _onSelectTopic, onToggleCompleted: _onToggleCompleted }: { units: Unit[]; completed: string[]; onSelectTopic: (id: string) => void; onToggleCompleted: (id: string) => void }) {
  const [openTopicId, setOpenTopicId] = useState<string | null>(null)
  return <><PageHeading eyebrow="خريطة المقرر" title="المادة على هيئة مسار" description="اضغطي على أي عقد لفتح شرحه تحته، واضغطي عليه مرة أخرى لإغلاقه. لن تنتقلي إلى صفحة أخرى." action={<span className="heading-badge"><BookOpen size={15} /> 6 وحدات · 20 موضوعاً</span>} /><div className="unit-map">{units.map(unit => { const Icon = unit.icon; const unitDone = unit.topics.every(topic => completed.includes(topic.id)); return <section className={`unit-card ${unitDone ? 'complete' : ''}`} key={unit.id}><div className="unit-card-head"><span className="unit-index">{unit.index}</span><div className="unit-icon"><Icon size={20} /></div><div><span className={`category-label category-${unit.category}`}>{unit.category}</span><h2>{unit.title}</h2><p>{unit.description}</p></div><div className="unit-meta"><span>{unit.duration}</span><strong>{unit.topics.filter(topic => completed.includes(topic.id)).length}/{unit.topics.length} مكتمل</strong></div></div><div className="unit-topics">{unit.topics.map(topic => <div className="unit-topic-accordion" key={topic.id}><button className={`unit-topic ${openTopicId === topic.id ? 'open' : ''} ${completed.includes(topic.id) ? 'complete' : ''}`} onClick={() => setOpenTopicId(current => current === topic.id ? null : topic.id)} aria-expanded={openTopicId === topic.id}><span>{completed.includes(topic.id) ? <Check size={14} /> : <span className="topic-mini-dot" />}</span><div><strong>{topic.title}</strong><small>{topic.short}</small></div><ChevronLeft size={16} /></button>{openTopicId === topic.id && <InlineTopicText topic={topic} />}</div>)}</div></section> })}</div></>
}

function OutcomesView() { return <><PageHeading eyebrow="مصفوفة التعلم" title="من الحفظ إلى التحليل" description="نواتج التعلم مصاغة لتربط المعرفة النظامية بالمهارة المهنية والمسؤولية الأخلاقية." /><div className="outcome-grid"><OutcomeCard tone="knowledge" number="01" title="المعرفة والفهم" icon={<BookOpen />} outcomes={['توضيح مفهوم العقود المدنية وطبيعتها.', 'التعرف على أنواع العقود المدنية والعقود المسماة وغير المسماة ومفهومها وخصائصها وأحكامها.']} linked="المدخل · خريطة العقود" /><OutcomeCard tone="skills" number="02" title="المهارات" icon={<Target />} outcomes={['تحليل النصوص النظامية التي تصدرها الدولة ونصوص المعاهدات الدولية.', 'استخدام المنهج العلمي وأساليب التفكير النقدي والمهارات التقنية والعددية في البحث وجمع المعلومات وتحليلها وحل المشكلات.', 'التواصل الفعال والمقنع شفهياً وكتابياً لصياغة العقود ومذكرات الدعاوى وفق الأنظمة.']} linked="كل الوحدات · الاختبارات" /><OutcomeCard tone="values" number="03" title="القيم والاستقلالية والمسؤولية" icon={<ShieldCheck />} outcomes={['الالتزام بالأمانة ومبادئ وأخلاقيات المهنة.', 'تحمل مسؤولية التعلم الذاتي بمواكبة التحديثات التي تساهم في تطويره مهنياً ومهارياً.', 'المساهمة في العمل الجماعي بشكل فعال كقائد.']} linked="المسائل التطبيقية · النقاش" /></div><div className="outcome-ribbon"><div className="ribbon-icon"><Sparkles size={20} /></div><div><strong>كيف تستخدمين هذه المصفوفة؟</strong><p>بعد كل موضوع، اسألي نفسك: هل عرفت القاعدة؟ هل استطعت تكييف المسألة؟ وهل صغت النتيجة بمسؤولية مهنية؟</p></div></div></> }
function OutcomeCard({ tone, number, title, icon, outcomes, linked }: { tone: string; number: string; title: string; icon: React.ReactNode; outcomes: string[]; linked: string }) { return <article className={`outcome-card ${tone}`}><div className="outcome-top"><span>{number}</span><div className="outcome-icon">{icon}</div></div><h2>{title}</h2><div className="outcome-list">{outcomes.map(outcome => <div key={outcome}><Check size={15} /><span>{outcome}</span></div>)}</div><div className="outcome-linked"><span>مرتبط بـ</span><strong>{linked}</strong></div></article> }

function IRACView() {
  const [topicId, setTopicId] = useState('sale')
  const [answers, setAnswers] = useState({ issue: '', rule: '', application: '', conclusion: '' })
  const [feedback, setFeedback] = useState<string[]>([])
  const [hint, setHint] = useState('')
  const topic = allTopics.find(item => item.id === topicId) || allTopics[0]
  const prompts = { issue: 'ما السؤال القانوني الذي يجب أن تجيبي عنه؟ لا تعيدي كتابة القصة.', rule: 'ما النص أو القاعدة التي تحكم السؤال؟ اذكري المادة إن عرفتها.', application: 'ما الوقائع المهمة؟ اربطي كل واقعة بالقاعدة ولا تكتفي بسردها.', conclusion: 'ما النتيجة الأقرب؟ اكتبيها بصيغة مشروطة ومعللة.' }
  const updateAnswer = (key: keyof typeof answers, value: string) => setAnswers(current => ({ ...current, [key]: value }))
  const evaluate = () => {
    const labels = { issue: 'المسألة', rule: 'القاعدة', application: 'التطبيق', conclusion: 'الاستنتاج' }
    setFeedback((Object.keys(answers) as (keyof typeof answers)[]).map(key => answers[key].trim().length >= 18 ? `جيد: كتبتِ إجابة قابلة للمراجعة في مرحلة ${labels[key]}.` : `تحتاج مرحلة ${labels[key]} إلى تفصيل أكبر: ${prompts[key]}`))
  }
  const showHint = (key: keyof typeof answers) => setHint(`${key === 'issue' ? 'ابدئي بعبارة: هل يحق لـ...؟' : key === 'rule' ? `ابدئي من ${topic.article || 'المواد الخاصة بالعقد والقواعد العامة.'}` : key === 'application' ? `استخرجي من المثال: ${topic.pillars.slice(0, 2).join('، ')}.` : 'استخدمي: لذلك، وبناءً عليه، فإن...'}`)
  return <><PageHeading eyebrow="مختبر التحليل القانوني" title="استراتيجية IRAC" description="أداة عملية من أربع خطوات: حددي المسألة، استخرجي القاعدة، طبقيها على الوقائع، ثم اكتبي النتيجة. شاهدي المثال أولاً ثم اختبري تحليلك." action={<span className="heading-badge"><Scale size={15} /> تحليل قابل للتجربة</span>} /><section className="irac-definition-card"><div className="irac-definition-head"><div><span className="panel-kicker"><GraduationCap size={16} /> ما هي IRAC؟</span><h2>لا تقفزي إلى النتيجة</h2><p>IRAC ليست قالباً للحفظ؛ هي ترتيب للتفكير يجعل إجابتك القانونية واضحة، قابلة للتتبع، ومبنية على النص والواقعة.</p></div><div className="irac-acronym"><strong>I · R · A · C</strong><span>سؤال · قاعدة · تطبيق · نتيجة</span></div></div><div className="irac-steps detailed"><div><b>I</b><strong>Issue · المسألة</strong><span>حوّلي الواقعة إلى سؤال قانوني محدد.</span></div><div><b>R</b><strong>Rule · القاعدة</strong><span>استندي إلى النص أو المبدأ النظامي.</span></div><div><b>A</b><strong>Application · التطبيق</strong><span>قارني عناصر القاعدة بالوقائع.</span></div><div><b>C</b><strong>Conclusion · الاستنتاج</strong><span>اكتبي نتيجة مختصرة ومعللة.</span></div></div></section><section className="irac-example"><div className="example-heading"><span className="panel-kicker"><BookOpen size={16} /> مثال ثابت محلول</span><span className="example-tag">عقد البيع · المادة 307</span></div><h2>اشترت سارة جهازاً، واتفق الطرفان على تسليمه خلال ثلاثة أيام، ثم ظهر عيب خفي.</h2><div className="example-grid"><div><b>I · المسألة</b><p>هل يثبت للمشتري حق عند ظهور عيب خفي في المبيع؟</p></div><div><b>R · القاعدة</b><p>البيع يملّك المبيع مقابل ثمن نقدي، وتُقرأ معه أحكام ضمان العيوب في المواد الخاصة بالبيع.</p></div><div><b>A · التطبيق</b><p>الجهاز هو المبيع، والثمن نقدي، والعيب الخفي يؤثر في الانتفاع؛ لذلك نتحقق من وقت العيب والعلم به وشروط الضمان.</p></div><div><b>C · الاستنتاج</b><p>إذا ثبت أن العيب كان خفياً ومؤثراً ومتحققاً وفق شروط النظام، فللمشتري التمسك بالأثر النظامي المناسب.</p></div></div><small>مثال تعليمي مختصر؛ راجعي النص الرسمي والمواد المرتبطة قبل بناء إجابة أكاديمية نهائية.</small></section><section className="irac-lab"><div className="lab-heading"><div><span className="panel-kicker"><Sparkles size={16} /> دورك الآن</span><h2>اكتبي تحليلك وسأراجعه تعليمياً</h2><p>اختاري عقداً، اقرئي الواقعة، ثم اكتبي إجابتك في أربع خانات. يمكنك طلب تلميح أو إرسال التحليل للتقييم.</p></div><label>اختاري العقد<select value={topicId} onChange={event => { setTopicId(event.target.value); setFeedback([]); setHint('') }}>{allTopics.filter(item => item.category !== 'مدخل').map(item => <option value={item.id} key={item.id}>{item.title}</option>)}</select></label></div><div className="lab-case"><span>الواقعة التدريبية</span><strong>{topic.title}</strong><p>{topic.example}</p><small>تذكير: ابحثي عن {topic.pillars.slice(0, 3).join('، ')}.</small></div><div className="irac-form">{(['issue', 'rule', 'application', 'conclusion'] as const).map((key, index) => <label key={key}><span><b>{['I', 'R', 'A', 'C'][index]}</b>{key === 'issue' ? 'المسألة القانونية' : key === 'rule' ? 'القاعدة النظامية' : key === 'application' ? 'التطبيق على الوقائع' : 'الاستنتاج'}</span><textarea value={answers[key]} onChange={event => updateAnswer(key, event.target.value)} placeholder={prompts[key]} /><button type="button" className="hint-button" onClick={() => showHint(key)}>أعطني تلميحاً</button></label>)}</div><div className="lab-actions"><button className="primary-button" onClick={evaluate}><CheckCircle2 size={16} /> قيّمي تحليلي</button><button className="secondary-button" onClick={() => { setAnswers({ issue: '', rule: '', application: '', conclusion: '' }); setFeedback([]); setHint('') }}><RotateCcw size={15} /> مسح الإجابة</button></div>{hint && <div className="irac-hint"><Sparkles size={16} /><span><strong>تلميح:</strong> {hint}</span></div>}{feedback.length > 0 && <div className="irac-feedback"><div className="feedback-header"><strong>مراجعة أولية لتحليلك</strong><span>{feedback.filter(item => item.startsWith('جيد')).length} / 4 مراحل مكتملة</span></div>{feedback.map(item => <p key={item} className={item.startsWith('جيد') ? 'good' : 'needs-work'}>{item}</p>)}</div>}</section></>
}

function MethodsView() { return <><PageHeading eyebrow="منهجية المقرر" title="تعلّم نشط، وتقييم متدرّج" description="المنصة تعكس الاستراتيجيات والتقييمات المعتمدة في توصيف المقرر، وتحوّل إيقاع شرائح الدكتورة إلى درس قابل للتفاعل." /><section className="lecture-rhythm"><div className="rhythm-heading"><span className="panel-kicker"><Sparkles size={17} /> قاموس الرموز التعليمية</span><h2>كل إشارة في الشرائح أصبحت خطوة في الدرس</h2></div><div className="rhythm-items"><div><span className="rhythm-icon theory"><BookOpen size={17} /></span><strong>الجانب النظري</strong><small>تعريف وخصائص وأركان</small></div><div><span className="rhythm-icon quote"><ScrollText size={17} /></span><strong>اقتباس</strong><small>المادة النظامية ذات الصلة</small></div><div><span className="rhythm-icon case"><Scale size={17} /></span><strong>دراسة قضية</strong><small>وقائع وأسئلة قانونية</small></div><div><span className="rhythm-icon task"><ClipboardCheck size={17} /></span><strong>تمرين فردي</strong><small>طبقي القاعدة بنفسك</small></div><div><span className="rhythm-icon quiz"><CircleHelp size={17} /></span><strong>اختبار قصير</strong><small>تغذية راجعة فورية</small></div></div></section><section className="irac-panel"><div className="irac-intro"><span className="panel-kicker"><Scale size={18} /> أداة التفكير القانوني</span><h2>حلّلي القضية بمنهجية IRAC</h2><p>كما في الشرائح: لا تقفزي إلى النتيجة. حوّلي الواقعة إلى سؤال، استخرجي القاعدة، طبقيها على الوقائع، ثم اكتبي خلاصة قصيرة ومبررة.</p></div><div className="irac-steps"><div><b>01</b><strong>Issue</strong><span>المسألة</span><small>ما السؤال القانوني الجوهري؟</small></div><div><b>02</b><strong>Rule</strong><span>القاعدة</span><small>ما النص أو المبدأ المنظم؟</small></div><div><b>03</b><strong>Application</strong><span>التطبيق</span><small>كيف تنطبق القاعدة على الوقائع؟</small></div><div><b>04</b><strong>Conclusion</strong><span>الاستنتاج</span><small>ما النتيجة والإجراء المناسب؟</small></div></div></section><div className="methods-layout"><section className="method-panel"><div className="panel-kicker"><GraduationCap size={18} /> استراتيجيات التدريس</div><h2>كيف نصل إلى الفهم؟</h2><div className="method-list"><MethodItem number="01" title="المحاضرات" text="بناء الإطار المفاهيمي وربط القواعد العامة بالعقود المسماة." /><MethodItem number="02" title="المناقشة والحوار" text="طرح أسئلة التكييف ومقارنة الحجج للوصول إلى نتيجة مبررة." /><MethodItem number="03" title="التعليم التعاوني" text="تقسيم المسألة إلى أدوار: وقائع، قاعدة، تطبيق، ونتيجة." /><MethodItem number="04" title="المطالعة ومراجعة السوابق القضائية" text="تدريب العين القانونية على البحث عن النص وتحليل مسار الاستدلال." /></div></section><section className="method-panel evaluation-panel"><div className="panel-kicker"><ClipboardCheck size={18} /> طرق التقييم</div><h2>أدلة تقدّمك</h2><div className="evaluation-list"><div><span className="evaluation-value">01</span><div><strong>الاختبارات</strong><p>أسئلة قصيرة وتغذية راجعة فورية لقياس الفهم.</p></div></div><div><span className="evaluation-value">02</span><div><strong>التكاليف</strong><p>تطبيق القاعدة وصياغة الرأي القانوني على وقائع مختارة.</p></div></div><div><span className="evaluation-value">03</span><div><strong>الملاحظة</strong><p>متابعة المشاركة، الحوار، وتحمل مسؤولية التعلم.</p></div></div></div><div className="evaluation-note"><Scale size={17} /><span>التقييم الأفضل ليس رقماً فقط؛ إنه دليل على قدرتك على التفسير والتطبيق والتواصل.</span></div></section></div><div className="teaching-strip"><div><span>زمن المقرر المتوقع</span><strong>4 ساعات تدريسية</strong></div><div><span>توزيع المراجعة</span><strong>12 · 8 · 4</strong></div><div><span>أداة التعلّم الذاتي</span><strong>الكتاب + النظام</strong></div></div></> }
function MethodItem({ number, title, text }: { number: string; title: string; text: string }) { return <div className="method-item"><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div><ChevronLeft size={17} /></div> }

function AssessmentView({ quizAnswers, quizSubmitted, setQuizAnswers, setQuizSubmitted, onReset }: { quizAnswers: Record<string, number>; quizSubmitted: Record<string, boolean>; setQuizAnswers: React.Dispatch<React.SetStateAction<Record<string, number>>>; setQuizSubmitted: React.Dispatch<React.SetStateAction<Record<string, boolean>>>; onReset: () => void }) { return <><PageHeading eyebrow="مختبر الاستيعاب" title="اختبري فهمك" description="اختاري إجابة لكل موضوع؛ بعد الإرسال ستظهر الإجابة الأدق والتغذية الراجعة التعليمية." action={<button className="reset-button" onClick={onReset}><RotateCcw size={15} /> تصفير التقدم</button>} /><div className="assessment-banner"><div className="assessment-icon"><CircleHelp size={24} /></div><div><strong>اختبار قصير · 18 سؤالاً</strong><p>ليس الهدف الحفظ الآلي؛ اقرئي السؤال كمسألة تكييف صغيرة، ثم اختاري القاعدة الأقرب.</p></div><div className="assessment-score"><span>أُجيب</span><strong>{Object.keys(quizSubmitted).length}<small> / {allTopics.length}</small></strong></div></div><div className="quiz-list">{allTopics.map((topic, index) => <QuizCard key={topic.id} topic={topic} index={index} answer={quizAnswers[topic.id]} submitted={Boolean(quizSubmitted[topic.id])} onAnswer={(answer) => setQuizAnswers(prev => ({ ...prev, [topic.id]: answer }))} onSubmit={() => setQuizSubmitted(prev => ({ ...prev, [topic.id]: true }))} />)}</div></> }
function QuizCard({ topic, index, answer, submitted, onAnswer, onSubmit }: { topic: Topic; index: number; answer?: number; submitted: boolean; onAnswer: (answer: number) => void; onSubmit: () => void }) { return <article className={`quiz-card ${submitted ? 'answered' : ''}`}><div className="quiz-meta"><span>سؤال {String(index + 1).padStart(2, '0')}</span><span className={`category-label category-${topic.category}`}>{topic.category}</span></div><h3>{topic.question}</h3><div className="quiz-options">{topic.options.map((option, optionIndex) => <button key={option} onClick={() => !submitted && onAnswer(optionIndex)} className={`${answer === optionIndex ? 'picked' : ''} ${submitted && optionIndex === topic.answer ? 'correct' : ''} ${submitted && answer === optionIndex && optionIndex !== topic.answer ? 'wrong' : ''}`}><span>{String.fromCharCode(0x623 + optionIndex)}</span>{option}{submitted && optionIndex === topic.answer && <Check size={15} />}</button>)}</div>{submitted && <p className={`quiz-feedback ${answer === topic.answer ? 'good' : 'needs-work'}`}><Sparkles size={14} />{answer === topic.answer ? topic.feedback : `راجعي: ${topic.options[topic.answer]}. ${topic.feedback}`}</p>}<button className="quiz-submit" disabled={answer === undefined || submitted} onClick={onSubmit}>{submitted ? 'تم التصحيح' : 'إرسال الإجابة'}<ArrowLeft size={15} /></button></article> }

function LegalSearchView({ onSelectTopic }: { onSelectTopic: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const [articles, setArticles] = useState<LegalArticle[]>([])
  const [explanations, setExplanations] = useState<ExplanationEntry[]>([])
  const [articlesLoading, setArticlesLoading] = useState(true)
  const rangeMap: Record<string, string> = { 'عقد البيع':'المواد 307–360', 'عقد المقايضة':'المواد 361–365', 'عقد الهبة':'المواد 366–381', 'عقد القرض':'المواد 382–390', 'عقد الصلح':'المواد 391–402', 'عقد المسابقة':'المواد 403–406', 'عقد الإيجار':'المواد 407–450', 'عقد الإعارة':'المواد 451–460', 'عقد المقاولة':'المواد 461–478', 'عقد العمل':'المواد 479–492', 'عقد الوكالة':'المواد 493–527', 'عقد الشركة':'المواد 528–579', 'عقد المضاربة':'المواد 548–558', 'عقد الكفالة':'المواد 580–594', 'عقد التأمين':'المواد 595–607' }
  useEffect(() => {
    Promise.all([
      fetch('/data/civil-transactions-articles.json').then(response => response.json()),
      fetch('/data/civil-transactions-explanations.json').then(response => response.json()),
    ])
      .then(([articleData, explanationData]) => {
        setArticles(articleData.articles || [])
        setExplanations(explanationData.articles || [])
      })
      .catch(() => { setArticles([]); setExplanations([]) })
      .finally(() => setArticlesLoading(false))
  }, [])
  const fallbackCatalog = useMemo(() => allTopics.flatMap(topic => {
    const references = topic.articles || (topic.article ? [topic.article] : [rangeMap[topic.title] || `أحكام ${topic.title}`])
    return references.map((reference, index) => ({ id: `${topic.id}-${index}`, reference, topic, article: { number: index, reference, text: topic.systemText || topic.definition, topicId: topic.id } as unknown as LegalArticle }))
  }), [])
  const catalog = useMemo(() => {
    const withExplanations = (article: LegalArticle) => ({
      ...article,
      explanation: explanations.find(item => item.articleNumber === article.number),
    })
    return articles.length
      ? articles.map(article => ({ id: `official-${article.number}`, reference: article.reference, topic: allTopics.find(topic => topic.id === article.topicId), article: withExplanations(article) }))
      : fallbackCatalog.map(item => ({ ...item, article: withExplanations(item.article) }))
  }, [articles, explanations, fallbackCatalog])
  const results = useMemo(() => {
    const clean = query.trim().toLowerCase()
    if (!clean) return catalog.slice(0, 12)
    return catalog.filter(item => [item.reference, item.article.text, item.topic?.title || '', item.topic?.short || ''].join(' ').toLowerCase().includes(clean) || String(item.article.number).includes(clean))
  }, [catalog, query])
  const totalCount = articles.length || fallbackCatalog.length
  return <><PageHeading eyebrow="مساعد النظام" title="البحث السريع في المواد النظامية" description="أدخلنا نصوص نظام المعاملات المدنية كاملة من المادة الأولى حتى المادة 721 من المصدر الرسمي. ابحثي برقم المادة أو بكلمة؛ سيظهر النص الرسمي ثم شرح مركز البحوث بوزارة العدل مع الجزء ورقم الصفحة." action={<span className="heading-badge"><Scale size={15} /> 721 مادة · 4 مجلدات شرح</span>} /><section className="legal-search-panel"><label className="legal-search-box"><Search size={20} /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="ابحثي برقم المادة أو كلمة مفتاحية..." aria-label="البحث في المواد النظامية" />{query && <button onClick={() => setQuery('')} aria-label="مسح البحث"><X size={16} /></button>}</label><div className="legal-search-help"><span>أمثلة للبحث</span><button onClick={() => setQuery('307')}>307</button><button onClick={() => setQuery('البيع')}>البيع</button><button onClick={() => setQuery('التسليم')}>التسليم</button><button onClick={() => setQuery('721')}>721</button></div></section><LegalTools /><div className="legal-results-head"><strong>{query ? `${results.length} نتيجة` : `${totalCount} مادة مفهرسة`}</strong><span>{query ? `نتائج البحث عن «${query}»` : articlesLoading ? 'جارٍ تحميل فهرس النظام والشرح...' : 'أول 12 مادة؛ ابحثي برقم المادة لعرض نصها وشرحها'}</span></div><div className="legal-results">{results.map(item => { const title = item.topic?.title || 'النظام العام'; const preview = query ? item.article.text : `${item.article.text.slice(0, 220)}${item.article.text.length > 220 ? '…' : ''}`; const related = item.topic ? catalog.filter(other => other.topic?.id === item.topic?.id && other.article.number !== item.article.number).slice(0, 4) : []; return <article className="legal-result" key={item.id}><div className="legal-result-top"><span className="article-number">م {item.article.number}</span><span className={`category-label ${item.topic ? `category-${item.topic.category}` : ''}`}>{item.topic?.category || 'نص النظام'}</span></div><h2>{item.reference}</h2><p className="legal-result-topic">{item.topic ? <>مرتبطة بـ <strong>{title}</strong></> : 'النص الرسمي للمادة'}</p><blockquote className="official-article-text">{preview}</blockquote><p className="legal-result-source"><FileText size={13} /> المصدر: هيئة الخبراء بمجلس الوزراء · <span>{item.article.explanationStatus}</span></p>{item.article.explanation && <div className="ministry-explanation"><div className="ministry-explanation-head"><span><BookMarked size={15} /> شرح مركز البحوث بوزارة العدل</span><a href={item.article.explanation.sourceFile} target="_blank" rel="noreferrer">فتح المجلد {item.article.explanation.part} <ExternalLink size={13} /></a></div><p>{item.article.explanation.excerpt}</p><small>{item.article.explanation.citation}</small></div>}<div className="article-analysis"><strong><Scale size={14} /> تحليل المادة</strong><p>{item.topic ? `تتناول المادة جانباً من ${title}؛ قارني بين عناصر العقد والواقعة، ثم حددي الأثر النظامي من النص والشرح أعلاه.` : 'اقرئي ألفاظ المادة، وحددي القاعدة، ونطاق تطبيقها، والاستثناءات أو المدد الواردة فيها قبل ربطها بالواقعة.'}</p>{related.length > 0 && <div className="related-articles"><span>مواد مرتبطة:</span>{related.map(other => <button key={other.id} onClick={() => setQuery(String(other.article.number))}>م {other.article.number}</button>)}</div>}</div><div className="legal-result-actions">{item.topic ? <button onClick={() => onSelectTopic(item.topic!.id)}>فتح شرح {title} <ArrowLeft size={15} /></button> : <span className="explanation-pending">لم يوجد موضوع مقرر مرتبط بهذه المادة</span>}<button onClick={() => copyText(`${item.reference}\n${item.article.text}${item.article.explanation ? `\n\n${item.article.explanation.citation}\n${item.article.explanation.excerpt}` : ''}`)}>نسخ المادة والشرح <FileText size={14} /></button><button onClick={() => shareText(item.reference, item.article.text)}>مشاركة <ExternalLink size={14} /></button><a href={officialSource} target="_blank" rel="noreferrer">فتح النص الرسمي <ExternalLink size={14} /></a></div></article>})}{!results.length && <div className="empty-state legal-empty"><Search size={28} /><strong>لم نعثر على مادة مطابقة</strong><span>جربي رقم المادة أو كلمة من نصها.</span></div>}</div></>
}

function extractArticleNumber(reference: string) { const match = reference.match(/\d+/); return match ? `م ${match[0]}` : 'نص' }

function copyText(text: string) { if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => undefined) }
function shareText(title: string, text: string) { if (navigator.share) navigator.share({ title, text, url: window.location.href }).catch(() => undefined); else copyText(`${title}\n${text}`) }

function LegalTools() {
  const [mode, setMode] = useState<'index' | 'compare' | 'calculator' | 'ask'>('index')
  const [firstId, setFirstId] = useState('sale'); const [secondId, setSecondId] = useState('lease')
  const [question, setQuestion] = useState(''); const [startDate, setStartDate] = useState(''); const [endDate, setEndDate] = useState('')
  const first = allTopics.find(topic => topic.id === firstId) || allTopics[0]; const second = allTopics.find(topic => topic.id === secondId) || allTopics[1]
  const days = startDate && endDate ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) : null
  const askAnswer = question ? allTopics.find(topic => `${topic.title} ${topic.definition} ${topic.short}`.includes(question.trim())) : null
  const indexGroups = [{title:'القواعد العامة للعقد', range:'المواد 30–114', text:'أركان العقد، الرضى، الأهلية، المحل والسبب، الآثار، التفسير والفسخ.'},{title:'عقد البيع وآثاره', range:'المواد 307–360', text:'المبيع والثمن، نقل الملكية، التسليم، الضمان، التزامات البائع والمشتري.'},{title:'المقايضة والهبة والقرض والصلح', range:'المواد 361–402', text:'العقود الواردة على الملكية وآثارها وانتهاؤها.'},{title:'المسابقة', range:'المواد 403–406', text:'إنشاء عقد المسابقة وشروط الجائزة والاستحقاق.'},{title:'الإيجار والإعارة', range:'المواد 407–460', text:'المنفعة، التسليم، الأجرة، المحافظة، الرد وانتهاء العقد.'},{title:'المقاولة والعمل والوكالة', range:'المواد 461–527', text:'إنجاز العمل، التبعية، النيابة، الإيداع والحراسة.'},{title:'الشركة والمضاربة والمشاركة', range:'المواد 528–579', text:'المشاركة في المشروع والربح والخسارة والإدارة.'},{title:'الكفالة والتأمين', range:'المواد 580–607', text:'الضمان الشخصي والتغطية التأمينية وفق النظام.'}]
  return <section className="legal-tools"><div className="legal-tool-tabs"><button className={mode === 'index' ? 'active' : ''} onClick={() => setMode('index')}><BookOpen size={15} /> الفهرس والتقسيم</button><button className={mode === 'compare' ? 'active' : ''} onClick={() => setMode('compare')}><Scale size={15} /> مقارنة المواد</button><button className={mode === 'calculator' ? 'active' : ''} onClick={() => setMode('calculator')}><CalendarDays size={15} /> حاسبة المدد</button><button className={mode === 'ask' ? 'active' : ''} onClick={() => setMode('ask')}><CircleHelp size={15} /> اسألي المقرر</button></div>{mode === 'index' && <div className="law-index-grid">{indexGroups.map(group => <div className="law-index-card" key={group.title}><span>{group.range}</span><h3>{group.title}</h3><p>{group.text}</p></div>)}</div>}{mode === 'compare' && <div className="compare-tool"><div className="compare-selects"><label>العقد الأول<select value={firstId} onChange={event => setFirstId(event.target.value)}>{allTopics.map(topic => <option key={topic.id} value={topic.id}>{topic.title}</option>)}</select></label><span>مقابل</span><label>العقد الثاني<select value={secondId} onChange={event => setSecondId(event.target.value)}>{allTopics.map(topic => <option key={topic.id} value={topic.id}>{topic.title}</option>)}</select></label></div><div className="compare-grid"><CompareCard topic={first} /><CompareCard topic={second} /></div></div>}{mode === 'calculator' && <div className="calculator-tool"><p>أداة تعليمية لحساب الفرق بين تاريخين. لا تغني عن التحقق من طريقة احتساب المدة في النص النظامي أو الحكم.</p><div className="date-inputs"><label>من تاريخ<input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} /></label><label>إلى تاريخ<input type="date" value={endDate} onChange={event => setEndDate(event.target.value)} /></label></div>{days !== null && <div className="calculator-result"><strong>{days >= 0 ? days : 0}</strong><span>يوماً تقريباً بين التاريخين</span></div>}</div>}{mode === 'ask' && <div className="ask-tool"><div className="ask-badge"><Sparkles size={18} /> اسألي المقرر</div><input value={question} onChange={event => setQuestion(event.target.value)} placeholder="مثال: ما أثر عقد البيع؟ ما الفرق بين القرض والعارية؟" />{question && <div className="ask-answer">{askAnswer ? <><strong>{askAnswer.title}</strong><p>{askAnswer.definition}</p><span>للتوسع: ابحثي عن «{askAnswer.title}» في مكتبة المقرر.</span></> : <><strong>لم أجد تطابقاً مباشراً</strong><p>جربي اسم عقد أو كلمة مفتاحية مثل: البيع، الإيجار، الضمان، التسليم، العيب.</p></>}</div>}</div>}</section>
}

function CompareCard({ topic }: { topic: Topic }) { return <article className="compare-card"><span className={`category-label category-${topic.category}`}>{topic.category}</span><h3>{topic.title}</h3><p>{topic.short}</p><strong>عناصره</strong><ul>{topic.pillars.map(item => <li key={item}>{item}</li>)}</ul><strong>مرجعه</strong><small>{topic.article || 'القواعد العامة والأحكام الخاصة في النظام'}</small></article> }

const precedentFocus: Record<string, {theme: string; application: string}> = {
  'عقد البيع': {theme:'إثبات البيع، العربون، تسليم الثمن، الغبن والعيب ونقل الملكية', application:'حللي المستندات والقرائن، ثم حددي الالتزام محل النزاع: انعقاد البيع، دفع الثمن، التسليم أو الضمان.'},
  'عقد الإيجار': {theme:'الإيجار، إخلاء العقار وتسليم المأجور', application:'حددي مدة الإيجار، الأجرة، سبب الإخلاء، وهل أُعيد المأجور وفق العقد.'},
  'عقد الكفالة': {theme:'الكفالة والضمان وإتلاف المال', application:'ابدئي بالدين الأصلي، ثم تحققي من نطاق التزام الكفيل وما إذا كان الضمان تابعاً له.'},
  'عقد الوكالة': {theme:'الوكالة والشراكة وتجاوز الصلاحية', application:'قارني التصرف بحدود الوكالة، ثم حددي أثر التجاوز على الموكل والغير.'},
  'عقد الشركة': {theme:'الشراكة والمنازعات بين الشركاء', application:'استخرجي اتفاق الشركاء، الإدارة، توزيع الربح والخسارة، ومحل الإخلال.'},
  'عقد القرض': {theme:'القرض والرهن والوفاء', application:'حددي مقدار الدين وموعده والضمان المرتبط به، ثم افحصي دليل التسليم والوفاء.'},
  'عقد المقاولة': {theme:'المقاولة وتسليم العمل والعيوب', application:'قارني الأعمال المنفذة بالمواصفات، وحددي أثر التسلم والعيب والتأخر.'},
  'عقد التأمين': {theme:'التأمين على المركبات والعقار وأخطار النقل', application:'اقرئي وثيقة التأمين: الخطر المؤمن منه، الاستثناءات، القسط، وإثبات وقوع الحادث.'},
}

function PrecedentsView({ onSelectTopic }: { onSelectTopic: (id: string) => void }) {
  return <><PageHeading eyebrow="مختبر التطبيق القضائي" title="السوابق القضائية وتطبيقات العقود" description="قسم تطبيقي مستخلص من تصنيف ملف السوابق القضائية المرفق، يحول موضوع القضية إلى سؤال تحليل يساعدك على ربط النص بالواقعة." action={<span className="heading-badge"><Scale size={15} /> قضايا العقود والمعاملات</span>} /><div className="precedent-banner"><div><strong>كيف تدرسين السابقة؟</strong><p>الوقائع ← المسألة ← النص النظامي ← التطبيق ← النتيجة. لا تكتفي بعنوان القضية؛ ابحثي عن سبب الحكم والقاعدة التي يمكن نقلها إلى واقعة مشابهة.</p></div><a href="/assets/judicial-precedents.pdf" target="_blank" rel="noreferrer">فتح ملف السوابق المرفق <ExternalLink size={15} /></a></div><div className="precedents-source-note"><FileText size={15} /> التصنيفات مستخلصة من قسم «قضايا العقود والمعاملات» في الملف المرفق، مع رابط المصدر الأصلي للمراجعة.</div><div className="precedents-grid">{allTopics.filter(topic => topic.category !== 'مدخل').map(topic => { const focus = precedentFocus[topic.title] || {theme:`تطبيقات عملية مرتبطة بـ ${topic.title}`, application:`كيّفي الواقعة أولاً، ثم اربطيها بأركان ${topic.title} وآثاره والمواد النظامية ذات الصلة.`}; return <article className="precedent-card" key={topic.id}><div className="precedent-card-head"><span className={`category-label category-${topic.category}`}>{topic.category}</span><span className="precedent-tag">تطبيق عملي</span></div><h2>{topic.title}</h2><h4>{focus.theme}</h4><div className="precedent-analysis"><strong>طريقة التحليل</strong><p>{focus.application}</p></div><div className="precedent-card-actions"><button onClick={() => onSelectTopic(topic.id)}>فتح شرح العقد <ArrowLeft size={14} /></button><a href="/assets/judicial-precedents.pdf" target="_blank" rel="noreferrer">المصدر <ExternalLink size={14} /></a></div></article>})}</div><div className="precedents-disclaimer"><strong>تنبيه:</strong> هذه بطاقات تعليمية لتحديد موضوعات البحث والتطبيق، وليست عرضاً لحكم قضائي كامل أو استشارة قانونية. راجعي الملف المرفق والحكم أو المصدر الرسمي قبل الاعتماد الأكاديمي.</div></>
}

function SourcesView() { return <><PageHeading eyebrow="مراجع المقرر" title="النص من مصدره، والشرح بلغتك" description="هذه المنصة طبقة تعليمية فوق المرجع؛ عند اختلاف الصياغة أو الحاجة إلى حكم كامل، ارجعي إلى النص الرسمي والكتاب المرفق." /><div className="sources-grid"><a className="source-card primary-source" href={officialSource} target="_blank" rel="noreferrer"><div className="source-card-icon"><Scale size={22} /></div><span className="source-type">مرجع نظامي رسمي</span><h2>نظام المعاملات المدنية</h2><p>النص الكامل المنشور عبر هيئة الخبراء بمجلس الوزراء ومنصة التشريعات السعودية، إصدار 1444هـ.</p><span className="source-link">فتح المصدر الرسمي <ExternalLink size={15} /></span></a><a className="source-card" href={bookSource} target="_blank" rel="noreferrer"><div className="source-card-icon"><BookMarked size={22} /></div><span className="source-type">الكتاب المرفق</span><h2>العقود المدنية</h2><p>وفقاً لنظام المعاملات المدنية · د. فيصل مطروق السهلي ود. سلطان فجيح أبا العلا · الطبعة الأولى 1445/2024.</p><span className="source-link">فتح نسخة الكتاب <ArrowLeft size={15} /></span></a><div className="source-card source-details"><div className="source-card-icon"><GraduationCap size={22} /></div><span className="source-type">بيانات المنصة</span><h2>مؤسسة المنصة</h2><p className="author-name">الطالبة ميار مازن سليمان</p><div className="details-row"><span>الجامعة</span><strong>جامعة أم القرى</strong></div><div className="details-row"><span>الكلية</span><strong>الدراسات القضائية والأنظمة</strong></div><div className="details-row"><span>الإشراف</span><strong>د. منيرة عبدالعزيز العامر</strong></div></div></div><div className="citation-note"><FileText size={17} /><p><strong>تنبيه منهجي:</strong> الاقتباسات النظامية المعروضة مختارة للتعلّم، ولا تغني عن مراجعة النسخة الرسمية المحدثة ولا تشكل استشارة قانونية.</p></div></> }

export default App

createRoot(document.getElementById('root')!).render(<App />)
