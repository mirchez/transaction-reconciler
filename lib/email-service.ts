import { prisma } from "@/lib/db";

/**
 * Email-based service to handle data isolation for users
 */
export class EmailService {
  /**
   * Get or create an email record
   */
  static async getOrCreateEmail(email: string, name?: string) {
    try {
      let emailRecord = await prisma.email.findUnique({
        where: { email }
      });

      if (!emailRecord) {
        emailRecord = await prisma.email.create({
          data: {
            email,
            name: name || null,
          }
        });
      }

      return emailRecord;
    } catch (error) {
      console.error('Error getting or creating email:', error);
      throw new Error('Failed to get or create email record');
    }
  }

  /**
   * Get all ledger entries for a specific email
   */
  static async getLedgerEntries(email: string) {
    try {
      const emailRecord = await prisma.email.findUnique({
        where: { email },
        include: {
          ledgerEntries: {
            orderBy: { date: 'desc' }
          }
        }
      });

      return emailRecord?.ledgerEntries || [];
    } catch (error) {
      console.error('Error getting ledger entries:', error);
      throw new Error('Failed to get ledger entries');
    }
  }

  /**
   * Get all bank transactions for a specific email
   */
  static async getBankTransactions(email: string) {
    try {
      const emailRecord = await prisma.email.findUnique({
        where: { email },
        include: {
          bankTransactions: {
            orderBy: { date: 'desc' }
          }
        }
      });

      return emailRecord?.bankTransactions || [];
    } catch (error) {
      console.error('Error getting bank transactions:', error);
      throw new Error('Failed to get bank transactions');
    }
  }

  /**
   * Get all matches for a specific email
   */
  static async getMatches(email: string) {
    try {
      const emailRecord = await prisma.email.findUnique({
        where: { email },
        include: {
          matches: {
            include: {
              ledgerEntry: true,
              bankTransaction: true
            },
            orderBy: { date: 'desc' }
          }
        }
      });

      return emailRecord?.matches || [];
    } catch (error) {
      console.error('Error getting matches:', error);
      throw new Error('Failed to get matches');
    }
  }

  /**
   * Delete all data for a specific email (cascade delete)
   */
  static async deleteEmailData(email: string) {
    try {
      await prisma.email.delete({
        where: { email }
      });
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
      const count = await prisma.ledgerEntry.count({
        where: {
          email: { email }
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
      const count = await prisma.bankTransaction.count({
        where: {
          email: { email }
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
      const emailRecord = await prisma.email.findUnique({
        where: { email },
        include: {
          _count: {
            select: {
              ledgerEntries: true,
              bankTransactions: true,
              matches: true
            }
          }
        }
      });

      if (!emailRecord) {
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
      const matchedLedgerCount = await prisma.ledgerEntry.count({
        where: {
          emailId: emailRecord.id,
          matches: { some: {} }
        }
      });

      const matchedBankCount = await prisma.bankTransaction.count({
        where: {
          emailId: emailRecord.id,
          matches: { some: {} }
        }
      });

      return {
        ledgerEntries: emailRecord._count.ledgerEntries,
        bankTransactions: emailRecord._count.bankTransactions,
        matches: emailRecord._count.matches,
        matchedLedgerEntries: matchedLedgerCount,
        matchedBankTransactions: matchedBankCount,
        unmatchedLedgerEntries: emailRecord._count.ledgerEntries - matchedLedgerCount,
        unmatchedBankTransactions: emailRecord._count.bankTransactions - matchedBankCount
      };
    } catch (error) {
      console.error('Error getting email stats:', error);
      throw new Error('Failed to get email statistics');
    }
  }
}