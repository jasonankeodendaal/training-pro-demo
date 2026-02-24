import { supabase } from './supabaseClient';
import { mockServices, mockJobs, mockLeads, mockJobCards } from './localdata';

export async function getLeads() {
  if (supabase) {
    const { data, error } = await supabase.from('leads').select('*');
    if (error) throw error;
    return data;
  } else {
    return mockLeads;
  }
}

export async function getJobCards() {
  if (supabase) {
    const { data, error } = await supabase.from('job_cards').select('*');
    if (error) throw error;
    return data;
  } else {
    return mockJobCards;
  }
}

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
