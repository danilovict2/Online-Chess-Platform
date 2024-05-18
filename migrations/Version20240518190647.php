<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;


final class Version20240518190647 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE game ADD active_color VARCHAR(2) DEFAULT NULL');
        $this->addSql('ALTER TABLE game ADD fullmoves INT DEFAULT NULL');
        $this->addSql('ALTER TABLE game ADD halfmoves INT DEFAULT NULL');
        $this->addSql('ALTER TABLE game DROP turn');
        $this->addSql('ALTER TABLE game DROP turns_since_last_capture');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE game ADD turn VARCHAR(5) DEFAULT NULL');
        $this->addSql('ALTER TABLE game ADD turns_since_last_capture VARCHAR(5) DEFAULT NULL');
        $this->addSql('ALTER TABLE game DROP active_color');
        $this->addSql('ALTER TABLE game DROP fullmoves');
        $this->addSql('ALTER TABLE game DROP halfmoves');
    }
}
