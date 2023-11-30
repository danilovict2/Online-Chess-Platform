<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;


final class Version20231130174640 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE game ALTER pieces TYPE TEXT');
        $this->addSql('ALTER TABLE game ALTER turns_since_last_capture TYPE VARCHAR(5)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE game ALTER pieces TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE game ALTER turns_since_last_capture TYPE VARCHAR(255)');
    }
}
