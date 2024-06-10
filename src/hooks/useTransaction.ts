import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { Transaction, TransactionType } from "../types/Transaction";
import { useAuth } from "./useAuth";

const useTransaction = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      query(
        collection(firestore, "transactions"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as Transaction[];
        setTransactions(data);
        setLoading(false);
      },
      (error: any) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  const getFilteredTransactions = async (type: TransactionType) => {
    setLoading(true);
    try {
      const q = query(
        collection(firestore, "transactions"),
        where("userId", "==", user?.uid),
        where("type", "==", type),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
      setTransactions(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const newDocRef = doc(collection(firestore, "transactions"));
      console.log(transaction)

      await setDoc(newDocRef, {
        ...transaction,
        userId: user?.uid,
        timestamp: Timestamp.now(),
        id: newDocRef.id,
      });

      return newDocRef.id;
    } catch (error: any) {
      console.error("Error adding document: ", error);
      setLoading(false);
      setError(error.message);
    }
  };
  const updateTransaction = async (
    transactionId: string,
    updatedTransaction: Partial<Transaction>
  ) => {
    try {
      const transactionDocRef = doc(firestore, "transactions", transactionId);
      await setDoc(
        transactionDocRef,
        {
          ...updatedTransaction,
        },
        { merge: true }
      );
    } catch (err: any) {
      console.error("Error updating transaction: ", err);
      throw new Error(err.message);
    }
  };
  const deleteTransaction = async (transactionId: string) => {
    try {
      const transactionDocRef = doc(firestore, "transactions", transactionId);
      await deleteDoc(transactionDocRef);
    } catch (err: any) {
      console.error("Error deleting transaction: ", err);
      throw new Error(err.message);
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getFilteredTransactions,
  };
};

export default useTransaction;
