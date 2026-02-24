import { supabase } from './supabaseClient';
import { mockServices, mockJobs } from './localdata';

export async function getServices() {
  if (supabase) {
    const { data, error } = await supabase.from('services').select('*');
    if (error) throw error;
    return data;
  } else {
    return mockServices;
  }
}

export async function getServiceById(id: number) {
  if (supabase) {
    const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } else {
    return mockServices.find(service => service.id === id);
  }
}

export async function getJobs() {
  if (supabase) {
    const { data, error } = await supabase.from('jobs').select('*');
    if (error) throw error;
    return data;
  } else {
    return mockJobs;
  }
}

export async function getJobById(id: number) {
  if (supabase) {
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } else {
    return mockJobs.find(job => job.id === id);
  }
}
