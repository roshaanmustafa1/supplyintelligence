import { topics, type Topic } from '@/data/topics'

export async function getAllTopics(): Promise<Topic[]> {
  return topics
}

export async function getTopicBySlug(slug: string): Promise<Topic | undefined> {
  return topics.find((topic) => topic.slug === slug)
}

export async function getTopicById(id: string): Promise<Topic | undefined> {
  return topics.find((topic) => topic.id === id)
}
