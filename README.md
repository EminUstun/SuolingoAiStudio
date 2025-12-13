
# 🚀 SUOLINGO

**Suolingo**, Google'ın en yeni **Gemini 2.5** ve **Veo** modelleri ile güçlendirilmiş, yeni nesil bir sesli dil öğrenme asistanıdır. Geleneksel dil öğrenme uygulamalarının ötesine geçerek, kullanıcıya tamamen kişiselleştirilmiş, görsel ve işitsel bir yapay zeka deneyimi sunar.

![Project Status](https://img.shields.io/badge/Status-Live-success)
![AI Model](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-blue)
![Tech](https://img.shields.io/badge/Tech-React%2019%20%7C%20Tailwind-61DAFB)

## 🌟 Öne Çıkan Özellikler

### 🧠 NotebookLM (Akıllı Defter)
Kendi ders notlarınızı veya makalelerinizi uygulamaya yükleyin. Gemini 2.5'in geniş bağlam penceresi sayesinde, yapay zeka **sadece sizin notlarınız üzerinden** sorularınızı yanıtlar. Sınavlara hazırlanmak için birebir!

### 🎬 Veo Avatar Stüdyosu
Statik bir fotoğraf yükleyin ve **Google Veo** video üretim modeli ile onu konuşan, göz kırpan, canlı bir karaktere dönüştürün. Kendi avatarınızla sohbet etme deneyimi!

### 🗣️ Gerçek Zamanlı İletişim (TTS & STT)
- **Text-to-Speech:** `gemini-2.5-flash-preview-tts` modeli ile insan doğallığında ses sentezi.
- **Speech-to-Text:** Konuştuklarınızı anlık olarak yazıya döken yüksek doğruluklu algılama.

### 📚 Kelime Kartları
Günlük kelime dağarcığınızı geliştirmek için hazırlanan, anlam ve Türkçe karşılıklarını içeren interaktif kartlar.

## 🛠️ Kullanılan Teknolojiler

Bu proje, modern web teknolojileri ve Google'ın en yeni AI SDK'ları kullanılarak geliştirilmiştir.

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS, Glassmorphism UI
- **AI SDK:** `@google/genai`
- **Models:**
  - `gemini-2.5-flash` (Mantık ve RAG işlemleri)
  - `gemini-2.5-flash-preview-tts` (Ses sentezi)
  - `veo-3.1-fast-generate-preview` (Video avatar üretimi)
  - `gemini-2.5-flash-image` (Görüntü işleme)

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için:

1. **Repoyu klonlayın:**
   ```bash
   git clone https://github.com/EminUstun/SuolingoAiStudio.git
   cd SuolingoAiStudio
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **API Anahtarını Ayarlayın:**
   Google AI Studio üzerinden alacağınız API anahtarını proje başladığında arayüzden girebilirsiniz. (Veo modeli için faturalı hesap gerekebilir).

4. **Uygulamayı Başlatın:**
   ```bash
   npm run dev
   ```

## 👨‍💻 Geliştirici

Bu proje **Emin Üstün** tarafından, **Nurettin Şenyer** ve **Ömer DURMUŞ** hocaların danışmanlığında geliştirilmiştir.
