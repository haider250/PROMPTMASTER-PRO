import { User } from '../../../shared/types/user';
import { EventEmitter } from 'events';

// Define types for collaboration
export interface CollaborationDocument {
  id: string;
  name: string;
  ownerId: string;
  collaboratorIds: string[];
  content: string;
  lastModifiedAt: Date;
  createdAt: Date;
}

export interface CollaborationActivity {
  documentId: string;
  userId: string;
  activityType: 'edit' | 'comment' | 'view' | 'create' | 'add_collaborator' | 'remove_collaborator' | 'join_session' | 'leave_session';
  timestamp: Date;
  details?: string;
}

export class CollaborationEngine extends EventEmitter {
  private documents: Map<string, CollaborationDocument>;
  private activeSessions: Map<string, Set<string>>; // documentId -> Set of userIds
  private privateKey: string; // Key required for sensitive operations

  constructor(privateKey: string) {
    super();
    if (!privateKey) {
      throw new Error("CollaborationEngine requires a private key for initialization.");
    }
    this.privateKey = privateKey;
    this.documents = new Map();
    this.activeSessions = new Map();
  }

  /**
   * Internal authorization check.
   * @param key The key provided for authorization.
   * @throws Error if the key is invalid.
   */
  private _authorize(key: string): void {
    if (this.privateKey !== key) {
      throw new Error("Unauthorized access to CollaborationEngine.");
    }
  }

  /**
   * Creates a new collaborative document.
   * @param name The name of the document.
   * @param ownerId The ID of the document owner.
   * @param initialContent The initial content of the document.
   * @param key The private key for authorization.
   * @returns The created CollaborationDocument.
   */
  public async createDocument(name: string, ownerId: string, initialContent: string = '', key: string): Promise<CollaborationDocument> {
    this._authorize(key);
    const newDocument: CollaborationDocument = {
      id: this.generateUniqueId(),
      name,
      ownerId,
      collaboratorIds: [ownerId],
      content: initialContent,
      lastModifiedAt: new Date(),
      createdAt: new Date(),
    };
    this.documents.set(newDocument.id, newDocument);
    this.logActivity(newDocument.id, ownerId, 'create', `Document '${name}' created.`);
    this.emit('documentCreated', newDocument);
    return newDocument;
  }

  /**
   * Retrieves a collaborative document by its ID.
   * @param documentId The ID of the document.
   * @returns The CollaborationDocument or null if not found.
   */
  public async getDocument(documentId: string): Promise<CollaborationDocument | null> {
    const document = this.documents.get(documentId);
    if (document) {
      this.emit('documentViewed', documentId);
    }
    return document || null;
  }

  /**
   * Updates the content of a collaborative document.
   * @param documentId The ID of the document.
   * @param userId The ID of the user performing the update.
   * @param newContent The new content for the document.
   * @param key The private key for authorization.
   * @returns The updated CollaborationDocument.
   * @throws Error if the document is not found or user is not a collaborator.
   */
  public async updateDocumentContent(documentId: string, userId: string, newContent: string, key: string): Promise<CollaborationDocument> {
    this._authorize(key);
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error(`Document with ID ${documentId} not found.`);
    }
    if (!document.collaboratorIds.includes(userId)) {
      throw new Error(`User ${userId} is not authorized to edit document ${documentId}.`);
    }

    document.content = newContent;
    document.lastModifiedAt = new Date();
    this.documents.set(documentId, document); // Persist the update
    this.logActivity(documentId, userId, 'edit', 'Document content updated.');
    this.emit('documentUpdated', document);
    return document;
  }

  /**
   * Adds a collaborator to a document.
   * @param documentId The ID of the document.
   * @param ownerId The ID of the user initiating the collaboration.
   * @param newCollaboratorId The ID of the user to add as a collaborator.
   * @param key The private key for authorization.
   * @returns The updated CollaborationDocument.
   * @throws Error if the document is not found or owner is not authorized.
   */
  public async addCollaborator(documentId: string, ownerId: string, newCollaboratorId: string, key: string): Promise<CollaborationDocument> {
    this._authorize(key);
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error(`Document with ID ${documentId} not found.`);
    }
    if (document.ownerId !== ownerId) {
      throw new Error(`User ${ownerId} is not authorized to add collaborators to document ${documentId}.`);
    }
    if (!document.collaboratorIds.includes(newCollaboratorId)) {
      document.collaboratorIds.push(newCollaboratorId);
      this.documents.set(documentId, document);
      this.logActivity(documentId, ownerId, 'add_collaborator', `User ${newCollaboratorId} added as collaborator.`);
      this.emit('collaboratorAdded', documentId, newCollaboratorId);
    }
    return document;
  }

  /**
   * Removes a collaborator from a document.
   * @param documentId The ID of the document.
   * @param ownerId The ID of the user initiating the removal.
   * @param collaboratorToRemoveId The ID of the user to remove.
   * @param key The private key for authorization.
   * @returns The updated CollaborationDocument.
   * @throws Error if the document is not found, owner is not authorized, or collaborator not found.
   */
  public async removeCollaborator(documentId: string, ownerId: string, collaboratorToRemoveId: string, key: string): Promise<CollaborationDocument> {
    this._authorize(key);
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error(`Document with ID ${documentId} not found.`);
    }
    if (document.ownerId !== ownerId) {
      throw new Error(`User ${ownerId} is not authorized to remove collaborators from document ${documentId}.`);
    }

    const index = document.collaboratorIds.indexOf(collaboratorToRemoveId);
    if (index > -1) {
      document.collaboratorIds.splice(index, 1);
      this.documents.set(documentId, document);
      this.logActivity(documentId, ownerId, 'remove_collaborator', `User ${collaboratorToRemoveId} removed from collaborators.`);
      this.emit('collaboratorRemoved', documentId, collaboratorToRemoveId);
    } else {
      throw new Error(`Collaborator ${collaboratorToRemoveId} not found in document ${documentId}.`);
    }
    return document;
  }

  /**
   * Joins a collaborative editing session for a document.
   * @param documentId The ID of the document.
   * @param userId The ID of the user joining the session.
   * @param key The private key for authorization.
   * @returns true if joined, false if already in session.
   * @throws Error if document not found or user not a collaborator.
   */
  public async joinSession(documentId: string, userId: string, key: string): Promise<boolean> {
    this._authorize(key);
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error(`Document with ID ${documentId} not found.`);
    }
    if (!document.collaboratorIds.includes(userId)) {
      throw new Error(`User ${userId} is not authorized to join session for document ${documentId}.`);
    }

    if (!this.activeSessions.has(documentId)) {
      this.activeSessions.set(documentId, new Set());
    }
    const session = this.activeSessions.get(documentId)!;
    if (session.has(userId)) {
      return false; // Already in session
    }
    session.add(userId);
    this.logActivity(documentId, userId, 'join_session', `User ${userId} joined session.`);
    this.emit('userJoinedSession', documentId, userId);
    return true;
  }

  /**
   * Leaves a collaborative editing session for a document.
   * @param documentId The ID of the document.
   * @param userId The ID of the user leaving the session.
   * @param key The private key for authorization.
   * @returns true if left, false if not in session.
   */
  public async leaveSession(documentId: string, userId: string, key: string): Promise<boolean> {
    this._authorize(key);
    const session = this.activeSessions.get(documentId);
    if (session && session.has(userId)) {
      session.delete(userId);
      if (session.size === 0) {
        this.activeSessions.delete(documentId); // No more active users for this document
      }
      this.logActivity(documentId, userId, 'leave_session', `User ${userId} left session.`);
      this.emit('userLeftSession', documentId, userId);
      return true;
    }
    return false; // Not in session
  }

  /**
   * Gets a list of active collaborators for a document.
   * @param documentId The ID of the document.
   * @returns An array of user IDs currently in the session.
   */
  public getActiveCollaborators(documentId: string): string[] {
    const session = this.activeSessions.get(documentId);
    return session ? Array.from(session) : [];
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private logActivity(documentId: string, userId: string, activityType: CollaborationActivity['activityType'], details?: string) {
    const activity: CollaborationActivity = {
      documentId,
      userId,
      activityType,
      timestamp: new Date(),
      details
    };
    // In a real application, this would persist to a database
    console.log('Collaboration Activity:', activity);
    this.emit('activityLogged', activity);
  }
}
