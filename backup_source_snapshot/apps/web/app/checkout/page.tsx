import React from 'react';
import styles from './Checkout.module.css';
import PaymentSelector from './PaymentSelector';
import { SITE_CONFIG } from '@/config/site';

export const metadata = {
  title: 'Finalizar Compra | SaidonClub',
};

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const resolvedParams = await searchParams;
  const planId = resolvedParams.plan || 'preferente';
  
  const planDetails: Record<string, { name: string, price: number, points: number }> = {
    'preferente': { 
      name: SITE_CONFIG.memberships.preferente.name, 
      price: SITE_CONFIG.memberships.preferente.price, 
      points: SITE_CONFIG.memberships.preferente.points 
    },
    'pionero': { 
      name: SITE_CONFIG.memberships.pionero.name, 
      price: SITE_CONFIG.memberships.pionero.price, 
      points: SITE_CONFIG.memberships.pionero.points 
    }
  };
  
  const plan = planDetails[planId as keyof typeof planDetails] || planDetails['preferente'];

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.leftCol}>
          <h1 className={styles.title}>Finalizar Compra</h1>
          <p className={styles.subtitle}>Selecciona tu método de pago preferido para activar tu membresía.</p>
          
          <PaymentSelector planId={planId} planAmount={plan.price} />
        </div>
        
        <div className={styles.rightCol}>
          <div className={styles.orderSummary}>
            <h3>Resumen del Pedido</h3>
            
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>
                <span>Membresía {plan.name}</span>
                <span className={styles.summaryDesc}>Acceso a beneficios exclusivos</span>
              </div>
              <span className={styles.summaryPrice}>${plan.price}.00</span>
            </div>
            
            <div className={styles.divider} />
            
            <div className={styles.summaryTotal}>
              <span>Total a Pagar</span>
              <span className={styles.totalPrice}>${plan.price}.00 USD</span>
            </div>
            
            <div className={styles.bonusBox}>
              <div className={styles.bonusIcon}>🎁</div>
              <div>
                <h4>Bono de Bienvenida</h4>
                <p>Recibirás {plan.points} Puntos Saidon ($ {plan.points * 0.01}) al activar tu cuenta.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
