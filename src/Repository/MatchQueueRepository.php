<?php

namespace App\Repository;

use App\Entity\MatchQueue;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MatchQueue>
 *
 * @method MatchQueue|null find($id, $lockMode = null, $lockVersion = null)
 * @method MatchQueue|null findOneBy(array $criteria, array $orderBy = null)
 * @method MatchQueue[]    findAll()
 * @method MatchQueue[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MatchQueueRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MatchQueue::class);
    }
}
