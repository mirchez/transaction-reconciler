import { prisma } from "@/lib/db";

/**
 * Email-based service to handle data isolation for users
 */
export class EmailService {
  /**
   * Get or create a user record
   */
  static async getOrCreateEmail(email: string, name?: string) {
    try {
      let userRecord = await prisma.user.findUnique({
        where: { email }
      });

      if (!userRecord) {
        userRecord = await prisma.user.create({
          data: {
            email,
          }
        });
      }

      return userRecord;
    } catch (error) {
      console.error('Error getting or creating user:', error);
      throw new Error('Failed to get or create user record');
    }
  }

  /**
   * Get all ledger entries for an email
   */
  static async getLedgerEntries(email: string) {
    try {
      const entries = await prisma.ledger.findMany({
        where: { userEmail: email },
        orderBy: { date: 'desc' }
      });

      return entries;
    } catch (error) {
      console.error('Error getting ledger entries:', error);
      return [];
    }
  }

  /**
   * Get all bank transactions for an email
   */
  static async getBankTransactions(email: string) {
    try {
      const transactions = await prisma.bank.findMany({
        where: { userEmail: email },
        orderBy: { date: 'desc' }
      });

      return transactions;
    } catch (error) {
      console.error('Error getting bank transactions:', error);
      return [];
    }
  }

  /**
   * Get all matches for an email
   */
  static async getMatches(email: string) {
    try {
      const matches = await prisma.matched.findMany({
        where: { userEmail: email },
        include: {
          ledger: true,
          bank: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return matches;
    } catch (error) {
      console.error('Error getting matches:', error);
      return [];
    }
  }

  /**
   * Delete all data for an email
   */
  static async deleteEmailData(email: string) {
    try {
      // Delete in order to respect foreign key constraints
      await prisma.matched.deleteMany({ where: { userEmail: email } });
      await prisma.ledger.deleteMany({ where: { userEmail: email } });
      await prisma.bank.deleteMany({ where: { userEmail: email } });
      await prisma.processedEmail.deleteMany({ where: { userEmail: email } });
      
      // Optionally delete the user record
      // await prisma.user.delete({ where: { email } });

      return { success: true };
    } catch (error) {
      console.error('Error deleting email data:', error);
      throw new Error('Failed to delete email data');
    }
  }

  /**
   * Check if email has any ledger data
   */
  static async hasLedgerData(email: string): Promise<boolean> {
    try {
      const count = await prisma.ledger.count({
        where: {
          userEmail: email
        }
      });
      return count > 0;
    } catch (error) {
      console.error('Error checking ledger data:', error);
      return false;
    }
  }

  /**
   * Check if email has any bank data
   */
  static async hasBankData(email: string): Promise<boolean> {
    try {
      const count = await prisma.bank.count({
        where: {
          userEmail: email
        }
      });
      return count > 0;
    } catch (error) {
      console.error('Error checking bank data:', error);
      return false;
    }
  }

  /**
   * Get statistics for a specific email
   */
  static async getEmailStats(email: string) {
    try {
      const userRecord = await prisma.user.findUnique({
        where: { email },
        include: {
          _count: {
            select: {
              ledgers: true,
              banks: true,
              matched: true
            }
          }
        }
      });

      if (!userRecord) {
        return {
          ledgerEntries: 0,
          bankTransactions: 0,
          matches: 0,
          matchedLedgerEntries: 0,
          matchedBankTransactions: 0,
          unmatchedLedgerEntries: 0,
          unmatchedBankTransactions: 0
        };
      }

      // Get detailed match counts
      const matchedLedgerCount = await prisma.ledger.count({
        where: {
          userEmail: email,
          matched: { some: {} }
        }
      });

      const matchedBankCount = await prisma.bank.count({
        where: {
          userEmail: email,
          matched: { some: {} }
        }
      });

      return {
        ledgerEntries: userRecord._count.ledgers,
        bankTransactions: userRecord._count.banks,
        matches: userRecord._count.matched,
        matchedLedgerEntries: matchedLedgerCount,
        matchedBankTransactions: matchedBankCount,
        unmatchedLedgerEntries: userRecord._count.ledgers - matchedLedgerCount,
        unmatchedBankTransactions: userRecord._count.banks - matchedBankCount
      };
    } catch (error) {
      console.error('Error getting email stats:', error);
      throw new Error('Failed to get email statistics');
    }
  }
}