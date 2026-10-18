'use client';

import { useState } from 'react';
import { SUCCESS_MESSAGES } from '@/constants';
import { toast } from 'sonner';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function useContactSupport() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success(SUCCESS_MESSAGES.CONTACT_SENT);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return {
    state: {
      formData,
      isSubmitting,
    },
    actions: {
      handleSubmit,
      handleChange,
      setFormData,
    },
  };
}
