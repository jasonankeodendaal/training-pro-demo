import { supabase } from './supabaseClient';
import { mockServices, mockJobs, mockLeads, mockJobCards } from './localdata';

export async function getLeads() {
  if (!supabase) return mockLeads;
  try {
    const { data, error } = await supabase.from('leads').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase error, falling back to mock data:', error);
    return mockLeads;
  }
}

export async function getJobCards() {
  if (!supabase) return mockJobCards;
  try {
    const { data, error } = await supabase.from('job_cards').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase error, falling back to mock data:', error);
    return mockJobCards;
  }
}

export async function getServices() {
  if (!supabase) return mockServices;
  try {
    const { data, error } = await supabase.from('services').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase error, falling back to mock data:', error);
    return mockServices;
  }
}

export async function getServiceById(id: number) {
  if (!supabase) return mockServices.find(service => service.id === id);
  try {
    const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase error, falling back to mock data:', error);
    return mockServices.find(service => service.id === id);
  }
}

export async function getJobs() {
  if (!supabase) return mockJobs;
  try {
    const { data, error } = await supabase.from('jobs').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase error, falling back to mock data:', error);
    return mockJobs;
  }
}

export async function getJobById(id: number) {
  if (!supabase) return mockJobs.find(job => job.id === id);
  try {
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase error, falling back to mock data:', error);
    return mockJobs.find(job => job.id === id);
  }
}
