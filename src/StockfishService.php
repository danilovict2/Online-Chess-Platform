<?php

namespace App;
use Symfony\Component\Process\InputStream;
use Symfony\Component\Process\Process;

class StockfishService
{
    public function getBestMove(int $elo, string $fen): string
    {
        $commands = [
            "ucinewgame",
            "setoption name UCI_LimitStrength value true",
            "setoption name UCI_Elo value $elo",
            "position fen $fen",
            "go movetime 3000"
        ];
        
        $output = $this->runCommand($commands);
        $bestMove = $this->extractBestMove($output);
        return $bestMove;
    }

    private function runCommand(array $commands): string
    {
        $process = new Process(['stockfish']);
        $input = new InputStream();
        $process->setInput($input);
        $process->start();

        foreach ($commands as $command) {
            $input->write($command . "\n");
        }

        // Wait for the final output from the 'go' command
        while ($process->isRunning()) {
            if (strpos($process->getOutput(), 'bestmove') !== false) {
                break;
            }
        }

        $input->close();
        $process->wait();

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
