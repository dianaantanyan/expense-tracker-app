import { BaseEntity, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Represents an entity with timestamp information.
 * Provides automatic tracking of creation, update, and soft deletion times.
 */
export abstract class TimestampedEntity extends BaseEntity {
    /**
     * The date and time when the entity was created.
     *
     * @type {Date}
     */
    @CreateDateColumn({ type: 'timestamptz' })
    public createdAt: Date;

    /**
     * The date and time when the entity was last updated.
     *
     * @type {Date}
     */
    @UpdateDateColumn({ type: 'timestamptz' })
    public updatedAt: Date;

    /**
     * The date and time when the entity was soft-deleted.
     * Will be null if the entity is not deleted.
     *
     * @type {Date | undefined}
     */
    @DeleteDateColumn({ type: 'timestamptz' })
    public deletedAt?: Date | null;
}