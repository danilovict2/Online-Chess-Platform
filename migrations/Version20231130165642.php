<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;


final class Version20231130165642 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE game ADD pieces VARCHAR(255)');
        $this->addSql('ALTER TABLE game ADD turn VARCHAR(5)');
        $this->addSql('ALTER TABLE game ADD turns_since_last_capture VARCHAR(255)');
        $this->addSql('ALTER TABLE game ADD piece_state_history TEXT');
        $this->addSql('ALTER TABLE game ADD black_timer VARCHAR(255)');
        $this->addSql('ALTER TABLE game ADD white_timer VARCHAR(255)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE game DROP pieces');
        $this->addSql('ALTER TABLE game DROP turn');
        $this->addSql('ALTER TABLE game DROP turns_since_last_capture');
        $this->addSql('ALTER TABLE game DROP piece_state_history');
        $this->addSql('ALTER TABLE game DROP black_timer');
        $this->addSql('ALTER TABLE game DROP white_timer');
    }
}
