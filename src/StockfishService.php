<?php

namespace App;
use Symfony\Component\Process\Process;

class StockfishService
{
    public function getBestMove(int $skillLevel, string $fen): string
    {
        $output = $this->runCommand("setoption name Skill Level value $skillLevel\nposition fen $fen\ngo\n");
        $bestMove = $this->extractBestMove($output);

        return $bestMove;
    }

    private function runCommand(string $command): string
    {
        $process = new Process(['stockfish']);
        $process->setInput($command);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new \RuntimeException($process->getErrorOutput());
        }

        return $process->getOutput();
    }

    private function extractBestMove(string $output): string
    {
        $lines = explode("\n", $output);
        foreach ($lines as $line) {
            if (strpos($line, 'bestmove') !== false) {
                $parts = explode(' ', $line);
                return $parts[1]; // Assuming bestmove is the second part
            }
        }

        throw new \RuntimeException('Best move not found in engine output');
    }
}
