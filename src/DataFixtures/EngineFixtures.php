<?php

namespace App\DataFixtures;

use App\Entity\Engine;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class EngineFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $engine = (new Engine())
            ->setElo(250)
            ->setSkillLevel(1);
        $manager->persist($engine);
        
        $engine = (new Engine())
            ->setElo(400)
            ->setSkillLevel(2);
        $manager->persist($engine);
        
        $engine = (new Engine())
            ->setElo(550)
            ->setSkillLevel(3);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(700)
            ->setSkillLevel(4);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(850)
            ->setSkillLevel(5);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(1000)
            ->setSkillLevel(6);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(1100)
            ->setSkillLevel(7);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(1200)
            ->setSkillLevel(8);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(1300)
            ->setSkillLevel(9);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(1400)
            ->setSkillLevel(10);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(1500)
            ->setSkillLevel(11);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(1600)
            ->setSkillLevel(12);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(1700)
            ->setSkillLevel(13);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(1800)
            ->setSkillLevel(14);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(1900)
            ->setSkillLevel(15);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(2000)
            ->setSkillLevel(16);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(2100)
            ->setSkillLevel(17);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(2200)
            ->setSkillLevel(18);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(2300)
            ->setSkillLevel(19);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(2400)
            ->setSkillLevel(20);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(2500)
            ->setSkillLevel(21);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(2600)
            ->setSkillLevel(22);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(2700)
            ->setSkillLevel(23);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(2900)
            ->setSkillLevel(24);
        $manager->persist($engine);

        $engine = (new Engine())
            ->setElo(3200)
            ->setSkillLevel(25);
        $manager->persist($engine);
        
        $manager->flush();
    }
}
