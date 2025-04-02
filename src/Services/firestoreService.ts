// firestoreService.ts
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    doc,
    getDoc,
    deleteDoc,
    updateDoc,
    Timestamp,
  } from "firebase/firestore";
  import { db } from "../firebase";
  

  export async function createPost(postData: {
    title: string;
    content: string;
    categoryId: string;
    imageUrl?: string | null;
  }) {
    const collectionRef = collection(db, "posts");
    const docRef = await addDoc(collectionRef, {
      ...postData,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    });
    return docRef.id; 
  }
  

  export async function getPostsByCategory(categoryId: string) {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("categoryId", "==", categoryId));
    const snapshot = await getDocs(q);
  
    const posts: any[] = [];
    snapshot.forEach((docSnap) => {
      posts.push({ id: docSnap.id, ...docSnap.data() });
    });
  
    return posts;
  }
  

  export async function getPostById(postId: string) {
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);
  
    if (!docSnap.exists()) {
      throw new Error("Post not found");
    }
  
    return { id: docSnap.id, ...docSnap.data() };
  }
  

  export async function deletePost(postId: string) {
    const docRef = doc(db, "posts", postId);
    await deleteDoc(docRef);
  }
  

  export async function updatePost(postId: string, data: Partial<{ title: string; content: string }>) {
    const docRef = doc(db, "posts", postId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  }