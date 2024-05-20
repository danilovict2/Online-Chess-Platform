<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;


final class Version20240520174248 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE game DROP pieces');
        $this->addSql('ALTER TABLE game DROP active_color');
        $this->addSql('ALTER TABLE game DROP fullmoves');
        $this->addSql('ALTER TABLE game DROP halfmoves');
        $this->addSql('ALTER TABLE game ALTER fen SET NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE game ADD pieces TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE game ADD active_color VARCHAR(2) DEFAULT NULL');
        $this->addSql('ALTER TABLE game ADD fullmoves INT DEFAULT NULL');
        $this->addSql('ALTER TABLE game ADD halfmoves INT DEFAULT NULL');
        $this->addSql('ALTER TABLE game ALTER fen DROP NOT NULL');
    }
}
