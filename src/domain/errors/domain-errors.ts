export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class NotFoundError extends DomainError {
  constructor(entityName: string, identifier: string) {
    super(`${entityName} with id "${identifier}" was not found.`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}
