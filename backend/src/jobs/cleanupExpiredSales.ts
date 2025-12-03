import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Cleanup expired pending sales
 * Runs every 5 minutes
 */
export const startCleanupJob = () => {
    // Run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        try {
            const now = new Date();

            // Find all expired pending sales
            const expiredSales = await prisma.sale.findMany({
                where: {
                    status: 'PENDING',
                    expiresAt: {
                        lte: now,
                    },
                },
            });

            if (expiredSales.length > 0) {
                // Delete expired sales (items will be deleted via cascade)
                const deletedCount = await prisma.sale.deleteMany({
                    where: {
                        status: 'PENDING',
                        expiresAt: {
                            lte: now,
                        },
                    },
                });

                console.log(`[CRON] Cleaned up ${deletedCount.count} expired sales at ${now.toISOString()}`);
            }
        } catch (error) {
            console.error('[CRON] Error cleaning up expired sales:', error);
        }
    });

    console.log('[CRON] Cleanup job started - runs every 5 minutes');
};
