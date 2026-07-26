import { defineCollection, z, reference } from 'astro:content';
import { glob } from 'astro/loaders';

// 1. Колекція для історії проєкту
const history = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/history" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
  })
});

// 2. Колекція для термінів (Монолітна структура)
const terms = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/terms" }),
  schema: z.object({
    title: z.string(), // Українська назва (напр., "Драйвер")
    english: z.string(), // Англійський оригінал (напр., "Driver")
    aliases: z.array(z.string()).default([]), // Синоніми (необов'язково, за замовчуванням порожній список)
  })
});

// 3. Колекція для майбутніх статей (з урахуванням Simple English)
const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(), // Короткий опис для списку статей
    pubDate: z.date(), // Дата публікації (задаємо руками)
    updatedDate: z.date().optional(), // Дата оновлення (необов'язково)
  })
});

// 4. Колекція для майбутніх курсів
const courses = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/courses" }),
  schema: z.discriminatedUnion('type', [
    
    // 1. Головна сторінка курсу
    z.object({
      type: z.literal('course_index'),
      title: z.string(),
      description: z.string(),
    }),

    // 2. Урок: Спеціальна стаття курсу
    z.object({
      type: z.literal('course_article'),
      title: z.string(),
    }),

    // 3. Урок: Посилання на існуючу статтю
    z.object({
      type: z.literal('global_article'),
      articleId: reference('articles'), 
    }),

    // 4. Урок: Відео
    z.object({
      type: z.literal('video'),
      title: z.string(),
      urls: z.object({
        youtube: z.string().url().optional(),
        vimeo: z.string().url().optional(),
      }),
    }),

    // 5. Урок: Домашнє завдання
    z.object({
      type: z.literal('homework'),
      title: z.string(),
    }),

    // 6. Урок: Q&A
    z.object({
      type: z.literal('qa'),
      title: z.string(),
    })
  ])
});


export const collections = { history, terms, articles, courses };