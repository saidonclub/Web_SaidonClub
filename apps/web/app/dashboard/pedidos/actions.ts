'use server';

import { cancelOrder } from '@/lib/data/dashboard';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function cancelOrderAction(orderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autorizado' };
  }

  try {
    await cancelOrder(orderId, user.id);
    revalidatePath(`/dashboard/pedidos/${orderId}`);
    revalidatePath('/dashboard/pedidos');
    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message || 'Error al cancelar el pedido' };
  }
}
