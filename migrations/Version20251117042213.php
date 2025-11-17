<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251117042213 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('DROP SEQUENCE match_queue_id_seq CASCADE');
        $this->addSql('ALTER TABLE match_queue DROP CONSTRAINT fk_c19700c2db75e1ee');
        $this->addSql('DROP TABLE match_queue');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SEQUENCE match_queue_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE match_queue (id INT NOT NULL, waiting_player_id INT NOT NULL, game_length INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX uniq_c19700c2db75e1ee ON match_queue (waiting_player_id)');
        $this->addSql('ALTER TABLE match_queue ADD CONSTRAINT fk_c19700c2db75e1ee FOREIGN KEY (waiting_player_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
