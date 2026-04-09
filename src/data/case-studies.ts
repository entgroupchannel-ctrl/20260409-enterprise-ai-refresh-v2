import caseShoeFactoryHero from "@/assets/case-shoe-factory-hero.jpg";
import caseFoodWaterproofHero from "@/assets/case-food-waterproof-hero.jpg";

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  products: { name: string; path?: string }[];
  image: string;
  logo?: string;
  testimonial?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
  externalLinks?: { label: string; url: string }[];
  internalLinks?: { label: string; path: string }[];
  youtubeVideos?: { title: string; videoId: string }[];
  facebookVideoId?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "airport-flight-info-display",
    title: "ระบบแสดงข้อมูลเที่ยวบินในสนามบินด้วย Industrial PC",
    client: "โครงการสนามบิน",
    industry: "การบินและขนส่ง",
    challenge: "สนามบินต้องการระบบแสดงข้อมูลเที่ยวบิน (FIDS) ที่ทำงานต่อเนื่อง 24/7 ทนต่อสภาพแวดล้อมที่มีผู้คนหนาแน่น และต้องมีความเสถียรสูงสุด เพราะหากระบบล่มจะส่งผลกระทบต่อผู้โดยสารจำนวนมาก",
    solution: "ติดตั้ง Industrial Fanless PC จาก ENT Group เชื่อมต่อจอแสดงผลขนาดใหญ่ ที่เกท, เช็คอินเคาน์เตอร์ และห้องรับสัมภาระ ระบบทำงาน Fanless ไม่มีเสียงรบกวน ไม่ต้องบำรุงรักษาพัดลม พร้อมระบบ Remote Monitoring ให้ทีม IT ดูแลจากศูนย์กลาง",
    results: [
      "Uptime 99.99% — ไม่มี Downtime ตลอด 3 ปีที่ติดตั้ง",
      "ลดค่าบำรุงรักษาลง 85% เทียบกับ Desktop PC",
      "รองรับการแสดงผล Real-time ข้อมูลเที่ยวบินจากทั่วโลก",
    ],
    products: [
      { name: "GT Series Fanless PC", path: "/gt-series" },
      { name: "Smart Display", path: "/smart-display" },
    ],
    image: "/images/unsplash/airport_w800.jpg",
    testimonial: "ระบบแสดงผลเที่ยวบินที่ติดตั้งไปทำงานได้อย่างเสถียร ไม่เคยมีเหตุขัดข้องจากฝั่ง Hardware เลย",
    testimonialAuthor: "ผู้จัดการฝ่าย IT",
    testimonialRole: "โครงการสนามบิน",
    externalLinks: [
      { label: "📦 ติดตามการส่งมอบสินค้าจริง", url: "https://www.facebook.com/entgroup.th/" },
      { label: "🌐 ดูข้อมูลเพิ่มเติม", url: "https://therdpume.wixsite.com/entgroup/site-references" },
    ],
    internalLinks: [
      { label: "ดู GT Series ทั้งหมด", path: "/gt-series" },
      { label: "ดู Smart Display", path: "/smart-display" },
    ],
  },
  {
    id: "mrt-underground-system",
    title: "ระบบคอมพิวเตอร์สำหรับโครงการรถไฟฟ้าใต้ดิน",
    client: "โครงการรถไฟฟ้าใต้ดิน",
    industry: "ระบบขนส่งมวลชน",
    challenge: "โครงการรถไฟฟ้าใต้ดินต้องการคอมพิวเตอร์ที่ทนทานต่อสภาพแวดล้อมใต้ดิน — ฝุ่นจากอุโมงค์ ความชื้นสูง แรงสั่นสะเทือนจากขบวนรถ และต้องทำงาน 24 ชั่วโมงไม่หยุดพัก สำหรับระบบจัดการสถานีและจอแสดงผลข้อมูลผู้โดยสาร",
    solution: "จัดหาและติดตั้ง Industrial Panel PC และ Fanless PC เกรดอุตสาหกรรม ที่ผ่านมาตรฐาน MIL-STD สำหรับแรงสั่นสะเทือน พร้อม IP65 กันฝุ่นและความชื้น ติดตั้งที่สถานีและห้องควบคุม",
    results: [
      "ผ่านการทดสอบ MIL-STD-810H สำหรับแรงสั่นสะเทือน",
      "ทำงานต่อเนื่อง 24/7 ในสภาพแวดล้อมใต้ดิน",
      "ลดค่าซ่อมบำรุงลง 75% เทียบกับอุปกรณ์เดิม",
    ],
    products: [
      { name: "Industrial Panel PC", path: "/gt-series" },
      { name: "EPC Series", path: "/epc-series" },
    ],
    image: "/images/unsplash/1565793298595-6a879b_w800.jpg",
    externalLinks: [
      { label: "📦 ติดตามความเคลื่อนไหว ENT Group", url: "https://www.facebook.com/entgroup.th/" },
    ],
    internalLinks: [
      { label: "ดู EPC Series", path: "/epc-series" },
    ],
  },
  {
    id: "thaweephol-vcloudpoint",
    title: "ทวีผล 1976 จำกัด เลือกใช้ vCloudPoint สำหรับสำนักงาน",
    client: "บริษัท ทวีผล 1976 จำกัด",
    industry: "ธุรกิจทั่วไป / สำนักงาน",
    challenge: "บริษัทมีคอมพิวเตอร์ Desktop หลายสิบเครื่องที่ต้องดูแลรักษา อัปเดตซอฟต์แวร์ทีละเครื่อง ค่าไฟสูง และเครื่องพังบ่อย ทีม IT มีภาระงานหนักมาก",
    solution: "เปลี่ยนมาใช้ vCloudPoint Zero Client ทั้งสำนักงาน เชื่อมต่อกับ Server กลาง ผู้ใช้งานทุกคนได้ Desktop เต็มรูปแบบ แต่ดูแลที่ Server ที่เดียว",
    results: [
      "ลดค่าไฟฟ้ากว่า 60% จาก Desktop เดิม",
      "ดูแลรักษาง่ายขึ้น — อัปเดตที่ Server ที่เดียว กระจายไปทุกเครื่อง",
      "ผู้ใช้งานพึงพอใจ — ใช้งานได้เหมือน Desktop ปกติ",
    ],
    products: [
      { name: "vCloudPoint Zero Client", path: "/vcloudpoint" },
    ],
    image: "/images/unsplash/1497366216548-375260_w800.jpg",
    testimonial: "ใช้ vCloudPoint มาแล้วกว่า 2 ปี ไม่มีปัญหาเลย ค่าไฟลด ค่าซ่อมหายไป ทีม IT สบายขึ้นเยอะ",
    testimonialAuthor: "ผู้จัดการ",
    testimonialRole: "บริษัท ทวีผล 1976 จำกัด",
    facebookVideoId: "324284324837607",
    externalLinks: [
      { label: "📺 ดูวิดีโอรีวิว (Facebook)", url: "https://www.facebook.com/entgroup.th/videos/324284324837607/" },
      { label: "📦 ติดตามความเคลื่อนไหว ENT Group", url: "https://www.facebook.com/entgroup.th/" },
    ],
    internalLinks: [
      { label: "ดู vCloudPoint ทั้งหมด", path: "/vcloudpoint" },
    ],
  },
  {
    id: "shoe-manufacturer-it-services",
    title: "IT Services สำหรับผู้ผลิตรองเท้าชั้นนำ",
    client: "ผู้ผลิตรองเท้าชั้นนำ",
    industry: "อุตสาหกรรมการผลิต",
    challenge: "โรงงานผลิตรองเท้าขนาดใหญ่ต้องการระบบ IT ครบวงจร — ตั้งแต่คอมพิวเตอร์สำหรับสายการผลิต ระบบเครือข่าย ไปจนถึงการดูแลรักษา แต่ไม่ต้องการจ้างทีม IT ประจำจำนวนมาก",
    solution: "ENT Group เข้าไปให้บริการ IT Services ครบวงจร ตั้งแต่จัดหา Industrial PC สำหรับไลน์ผลิต วางระบบ Network ทั้งโรงงาน และดูแลรักษาเชิงป้องกัน (Preventive Maintenance) รายเดือน",
    results: [
      "Downtime ลดลง 90% จากระบบ IT เดิม",
      "ไม่ต้องจ้างทีม IT ประจำเพิ่ม ประหยัดค่าใช้จ่ายบุคลากร",
      "ได้ทีมผู้เชี่ยวชาญดูแลตลอด มั่นใจในการผลิต",
    ],
    products: [
      { name: "GT Series Panel PC", path: "/gt-series" },
      { name: "Volktek Network Switch", path: "/volktek" },
    ],
    image: caseShoeFactoryHero,
    facebookVideoId: "996005083891871",
    externalLinks: [
      { label: "📺 ดูวิดีโอ (Facebook)", url: "https://www.facebook.com/entgroup.th/videos/996005083891871/" },
    ],
    internalLinks: [
      { label: "ดู GT Series ทั้งหมด", path: "/gt-series" },
    ],
  },
  {
    id: "nanthanawich-school-vcloudpoint",
    title: "ห้องเรียนคอมพิวเตอร์อัจฉริยะ โรงเรียนนันทนวิทย์",
    client: "โรงเรียนนันทนวิทย์",
    industry: "การศึกษา",
    challenge: "โรงเรียนต้องการจัดห้องเรียนคอมพิวเตอร์ที่รองรับนักเรียนจำนวนมาก แต่งบประมาณจำกัด คอมพิวเตอร์เดิมเก่าและช้า ทีม IT มีเพียง 1 คน ดูแลหลายสิบเครื่องไม่ไหว",
    solution: "ออกแบบและติดตั้งห้องเรียนคอมพิวเตอร์อัจฉริยะด้วย vCloudPoint โดยใช้ Server เพียง 1 เครื่อง รองรับนักเรียนได้ 30 คนพร้อมกัน ต้นทุนลดลงกว่า 60% เทียบกับซื้อ Desktop ทีละเครื่อง",
    results: [
      "ประหยัดงบจัดซื้อ 60% เทียบกับ Desktop 30 เครื่อง",
      "ดูแลง่าย — ครู IT คนเดียวจัดการได้ทั้งห้อง",
      "ใช้งานมากว่า 2 ปี ไม่มีปัญหา Hardware",
      "ได้ 270 Likes, 19 Comments, 60 Shares บน Facebook",
    ],
    products: [
      { name: "vCloudPoint Zero Client", path: "/vcloudpoint" },
    ],
    image: "/images/unsplash/1509062522246-375597_w800.jpg",
    testimonial: "ตอนแรกกังวลว่าจะช้า แต่ใช้จริงแล้ว ทำงานได้ดีมาก นักเรียนใช้ได้ทุกคนพร้อมกัน ผ่านมา 2 ปีกว่ายังดีมาก",
    testimonialAuthor: "อาจารย์ผู้ดูแลระบบ",
    testimonialRole: "โรงเรียนนันทนวิทย์",
    facebookVideoId: "1004417266383986",
    externalLinks: [
      { label: "📺 ดูวิดีโอ vCloudPoint โรงเรียนนันทนวิทย์ (Facebook)", url: "https://www.facebook.com/share/v/1GTHavarXz/" },
    ],
    internalLinks: [
      { label: "ดู vCloudPoint ทั้งหมด", path: "/vcloudpoint" },
    ],
  },
  {
    id: "amata-spring-golf-club",
    title: "AmataSpring Golf Club เลือก ENT Group ดูแลระบบ IT",
    client: "AmataSpring Golf Club",
    industry: "กอล์ฟคลับ / Hospitality",
    challenge: "สนามกอล์ฟระดับพรีเมียมต้องการระบบ IT ที่ดูแลทั้งอาคารสโมสร ร้านค้า Pro Shop ห้องอาหาร และระบบจองสนาม ระยะทางจากกรุงเทพฯ ไกล ต้องการทีมที่ไปถึงได้และดูแลอย่างมืออาชีพ",
    solution: "ENT Group ออกแบบและติดตั้งระบบ IT ครบวงจร — Network, คอมพิวเตอร์สำหรับจุดบริการ และระบบ POS พร้อมดูแลรักษารายเดือน แม้ระยะทางไกลก็ไม่เป็นอุปสรรค",
    results: [
      "ระบบ IT ทำงานเสถียร ไม่มี Downtime ที่กระทบการบริการลูกค้า",
      "ลดเวลาการตอบสนองเมื่อมีปัญหาจาก 1 วัน เหลือ 2 ชั่วโมง",
      "ลูกค้า VIP มั่นใจในระบบจองและบริการดิจิทัล",
    ],
    products: [
      { name: "Mini PC", path: "/mini-pc" },
      { name: "Volktek Network Switch", path: "/volktek" },
    ],
    image: "/images/unsplash/1587174486073-ae5e5c_w800.jpg",
    testimonial: "งานยากแค่ไหนก็ทำได้ ระยะทางก็ไม่ใช่อุปสรรค — มั่นใจกับทีมงาน IT ของ ENT Group",
    testimonialAuthor: "ฝ่ายบริหาร",
    testimonialRole: "AmataSpring Golf Club",
    facebookVideoId: "996009430558103",
    externalLinks: [
      { label: "📺 ดูวิดีโอ (Facebook)", url: "https://www.facebook.com/entgroup.th/videos/996009430558103/" },
    ],
  },
  {
    id: "automotive-factory-panel-pc",
    title: "ระบบควบคุมสายการผลิตชิ้นส่วนยานยนต์ด้วย Panel PC",
    client: "โรงงานผลิตชิ้นส่วนยานยนต์ ระยอง",
    industry: "อุตสาหกรรมยานยนต์",
    challenge: "โรงงานต้องการอัปเกรดระบบ HMI เดิมที่ล้าสมัย ให้รองรับ SCADA และ MES แบบ Real-time โดยเครื่องคอมพิวเตอร์ต้องทนทานต่อฝุ่น ความชื้น และแรงสั่นสะเทือนในไลน์ผลิต",
    solution: "ติดตั้ง GT Series Panel PC ขนาด 15\" และ 21\" จำนวน 24 เครื่อง ตลอดสายการผลิต พร้อมระบบ SCADA เชื่อมต่อ PLC Siemens และ Mitsubishi ผ่าน Ethernet/IP และ Modbus TCP",
    results: [
      "ลด Downtime ลง 35% จากการแจ้งเตือนแบบ Real-time",
      "เพิ่ม OEE จาก 72% เป็น 89%",
      "ROI คืนทุนภายใน 8 เดือน",
    ],
    products: [
      { name: "GT Series Panel PC 15\"", path: "/gt-series" },
      { name: "GT Series Panel PC 21\"", path: "/gt-series" },
    ],
    image: "/images/unsplash/1565043666747-69f664_w800.jpg",
    testimonial: "ระบบทำงานได้เสถียรมาก ไม่เคยมี Downtime จากฝั่ง Hardware เลยตลอด 2 ปีที่ใช้งาน",
    testimonialAuthor: "ผู้จัดการฝ่ายผลิต",
    testimonialRole: "โรงงานชิ้นส่วนยานยนต์ ระยอง",
    youtubeVideos: [
      { title: "GT Series Panel PC สำหรับงานโรงงาน", videoId: "GVAwUx4_eO0" },
    ],
    internalLinks: [
      { label: "ดู GT Series ทั้งหมด", path: "/gt-series" },
      { label: "ดู GK Series Panel PC", path: "/gk-series" },
    ],
    externalLinks: [
      { label: "🌐 ดูข้อมูลเพิ่มเติมที่ ENT Group", url: "https://therdpume.wixsite.com/entgroup/gt-series" },
    ],
  },
  {
    id: "hospital-mini-pc-thin-client",
    title: "ระบบ Thin Client สำหรับโรงพยาบาลขนาดใหญ่",
    client: "โรงพยาบาลเอกชนชั้นนำ กรุงเทพฯ",
    industry: "สาธารณสุข",
    challenge: "ต้องการเปลี่ยนคอมพิวเตอร์เดสก์ท็อปกว่า 200 เครื่องในจุดบริการต่างๆ เพื่อลดค่าใช้จ่ายด้าน IT และการบำรุงรักษา พร้อมรักษาความปลอดภัยข้อมูลผู้ป่วย",
    solution: "ติดตั้ง vCloudPoint Zero Client จำนวน 200 จุด ร่วมกับ Server ศูนย์กลาง โดยแต่ละจุดใช้งาน HIS ผ่าน Virtual Desktop",
    results: [
      "ประหยัดค่าไฟฟ้า 65% เทียบกับ Desktop PC",
      "ลดค่าบำรุงรักษา IT ลง 70% ต่อปี",
      "Zero Downtime จาก Hardware failure ในปีแรก",
    ],
    products: [
      { name: "vCloudPoint S100", path: "/vcloudpoint" },
    ],
    image: "/images/unsplash/1519494026892-80bbd2_w800.jpg",
    testimonial: "ช่วยลดภาระงาน IT ได้อย่างมาก สามารถ Deploy จุดบริการใหม่ได้ภายใน 5 นาที",
    testimonialAuthor: "ผู้อำนวยการฝ่าย IT",
    testimonialRole: "โรงพยาบาลเอกชน กรุงเทพฯ",
    internalLinks: [
      { label: "ดู vCloudPoint ทั้งหมด", path: "/vcloudpoint" },
    ],
  },
  {
    id: "warehouse-rugged-tablet",
    title: "ระบบจัดการคลังสินค้าด้วย Rugged Tablet",
    client: "บริษัทโลจิสติกส์ชั้นนำ สมุทรปราการ",
    industry: "โลจิสติกส์และคลังสินค้า",
    challenge: "พนักงานคลังใช้กระดาษและ Handheld Scanner รุ่นเก่า ทำให้เกิดข้อผิดพลาดในการหยิบสินค้า (Pick Error) สูง และไม่มีข้อมูล Real-time ของสต็อก",
    solution: "ติดตั้ง EM-T195 Rugged Tablet พร้อม Barcode Scanner ในตัว จำนวน 30 เครื่อง เชื่อมต่อกับระบบ WMS ผ่าน WiFi 6 ทั่วคลังสินค้า",
    results: [
      "ลด Pick Error จาก 3.2% เหลือ 0.1%",
      "เพิ่มความเร็วในการหยิบสินค้า 40%",
      "Tablet ทนทานต่อการตกจากความสูง 1.2 เมตร",
    ],
    products: [
      { name: "EM-T195 Rugged Tablet 5G", path: "/rugged-tablet/em-t195" },
    ],
    image: "/images/unsplash/1586528116311-ad8dd3_w800.jpg",
    testimonial: "จาก Pick Error เกือบ 4% ตอนนี้เหลือไม่ถึง 0.1% ลูกค้าพอใจมาก",
    testimonialAuthor: "Warehouse Manager",
    testimonialRole: "บริษัทโลจิสติกส์ สมุทรปราการ",
    internalLinks: [
      { label: "ดู Rugged Tablet ทั้งหมด", path: "/rugged-tablet" },
      { label: "ดู Handheld ทั้งหมด", path: "/handheld" },
    ],
    externalLinks: [
      { label: "🌐 ดูข้อมูล Rugged Devices เพิ่มเติม", url: "https://entgroup-rugged.com/" },
    ],
  },
  {
    id: "food-factory-waterproof-pc",
    title: "ระบบตรวจสอบคุณภาพอาหารด้วย Waterproof PC",
    client: "โรงงานแปรรูปอาหารส่งออก สมุทรสาคร",
    industry: "อุตสาหกรรมอาหาร",
    challenge: "สภาพแวดล้อมการผลิตมีความชื้นสูงและต้องล้างทำความสะอาดด้วยน้ำแรงดันสูงเป็นประจำ คอมพิวเตอร์ทั่วไปเสียหายบ่อย",
    solution: "ติดตั้ง Waterproof Panel PC ระดับ IP69K จำนวน 8 เครื่อง ที่จุดตรวจสอบคุณภาพ เชื่อมต่อกับเซ็นเซอร์วัดอุณหภูมิ ความชื้น และน้ำหนัก",
    results: [
      "ผ่านมาตรฐาน HACCP และ GMP",
      "ลดค่าซ่อมอุปกรณ์ลง 90%",
      "บันทึกข้อมูลคุณภาพแบบ Digital 100%",
    ],
    products: [
      { name: "Waterproof Panel PC IP69K", path: "/waterproof-pc" },
    ],
    image: caseFoodWaterproofHero,
    internalLinks: [
      { label: "ดู Waterproof PC ทั้งหมด", path: "/waterproof-pc" },
    ],
  },
  {
    id: "ai-classroom-nvidia-jetson",
    title: "ห้องเรียน AI สำหรับสถาบันการศึกษาด้วย NVIDIA Jetson",
    client: "มหาวิทยาลัยเทคโนโลยีชั้นนำ กรุงเทพฯ",
    industry: "การศึกษา / AI & Deep Learning",
    challenge: "สถาบันการศึกษาต้องการจัดตั้งห้องปฏิบัติการ AI ที่นักศึกษาสามารถเรียนรู้และฝึกฝน Deep Learning, Computer Vision ได้จริง แต่การใช้ GPU Server ราคาสูงเกินงบประมาณ",
    solution: "ติดตั้งห้องเรียน AI จำนวน 30 ชุด โดยใช้ NVIDIA Jetson Orin Nano และ Jetson Orin NX ติดตั้งบน iBox Edge AI Computer จาก ENT Group พร้อม JetPack SDK",
    results: [
      "นักศึกษา 120 คน/เทอม เข้าถึง Hardware AI ได้ทุกคน",
      "ประหยัดงบ 60% เทียบกับ GPU Server หรือ Cloud",
      "สร้างโปรเจกต์จริง เช่น ระบบนับคน ตรวจจับวัตถุ หุ่นยนต์อัตโนมัติ",
    ],
    products: [
      { name: "NVIDIA Jetson Orin Nano" },
      { name: "NVIDIA Jetson Orin NX" },
      { name: "iBox Edge AI Computer", path: "/ibox-series" },
    ],
    image: "/images/unsplash/1531482615713-2afd69_w800.jpg",
    testimonial: "นักศึกษาได้ลงมือทำจริงกับ Hardware AI ระดับอุตสาหกรรม ไม่ใช่แค่เรียนทฤษฎี ผลงานโปรเจกต์จบปีนี้ก้าวกระโดดมาก",
    testimonialAuthor: "หัวหน้าภาควิชาวิศวกรรมคอมพิวเตอร์",
    testimonialRole: "มหาวิทยาลัยเทคโนโลยี กรุงเทพฯ",
    externalLinks: [
      { label: "🌐 ดูสินค้า NVIDIA Jetson ทั้งหมด", url: "https://nvidia-jetson.com/" },
    ],
    internalLinks: [
      { label: "ดู iBox Series — Edge AI Computer", path: "/ibox-series" },
    ],
  },
];

/** รายชื่อลูกค้าบางส่วนจาก Site References */
export const clientList: string[] = [
  "บริษัท แอดวานซ์ ได-คัสติ้ง อินดัสทรี จำกัด",
  "บริษัท เจทีแอล อินเตอร์เทรด จำกัด",
  "บริษัทแสงไทยอุตสาหกรรม จำกัด",
  "โรงเรียนมุกดาหาร",
  "โรงเรียนคุรุประชาสรรค์",
  "บริษัท ช.รับเบอร์ แอนด์ โมลด์ จำกัด",
  "บริษัท เอ็ม เอส พี อินเตอร์ฟู้ดส์ จำกัด",
  "บริษัท ดี เพาเวอร์ ไอที เทคโนโลยี จำกัด",
  "บริษัท เอเซียคอมแพ็ค จำกัด",
  "บริษัท โนวัส อินทิเกรชั่น จำกัด",
  "บริษัท อมตะ สปริง ดีเวลลอปเม้นท์ จำกัด",
  "บริษัท สหไทย เทอร์มินอล จำกัด (มหาชน)",
  "บริษัท ซีคอท จำกัด",
  "บริษัท ทวีผล 1976 จำกัด",
  "บริษัท อุตสาหกรรมตราอูฐ จำกัด",
  "บริษัท คัลเลอ โกลโบล จำกัด",
  "บริษัท ไพโอเนีย ไฮ-เบรด (ไทยแลนด์) จำกัด",
  "บริษัท อันจิ-เอ็น วาย เค โลจิสติกส์ (ประเทศไทย) จำกัด",
  "บริษัท โมทนา ควอลิตี้ ฟู้ด จำกัด",
  "บริษัท ร่มโพธิ์ พร็อพเพอร์ตี้ จำกัด (มหาชน)",
  "บริษัท เดอะ สยาม เซรามิค กรุ๊ป อินดัสทรี่ส์ จำกัด",
  "บริษัท ทริพเพิล ไอ โลจิสติกส์ จำกัด",
  "บริษัท วี ฟิตเนส จำกัด",
  "Brevan Howard (Hong Kong) Limited",
  "บริษัท บางกอก บาร์จ เทอร์มินอล จำกัด",
];

/** ภาพ Site References (Local Assets) */
export const siteReferenceImages: { src: string; alt: string }[] = [
  { src: "/images/case-studies/site-ref-1.png", alt: "Site Reference — โครงการลูกค้า" },
  { src: "/images/case-studies/site-ref-2.png", alt: "Site Reference — โครงการโรงงาน" },
  { src: "/images/case-studies/site-ref-3.png", alt: "Site Reference — ห้องเรียน" },
  { src: "/images/case-studies/site-ref-4.png", alt: "Site Reference — ระบบ IT" },
  { src: "/images/case-studies/site-ref-5.png", alt: "Site Reference — Industrial PC" },
  { src: "/images/case-studies/site-ref-6.png", alt: "Site Reference — การติดตั้ง" },
];

/** ภาพงานติดตั้ง Panel PC (Local Assets) */
export const installationImages: { src: string; alt: string }[] = [
  { src: "/images/case-studies/install-1.png", alt: "งานติดตั้ง Panel PC 1" },
  { src: "/images/case-studies/install-2.png", alt: "งานติดตั้ง Panel PC 2" },
  { src: "/images/case-studies/install-3.png", alt: "งานติดตั้ง Panel PC 3" },
  { src: "/images/case-studies/install-4.png", alt: "งานติดตั้ง Panel PC 4" },
];
