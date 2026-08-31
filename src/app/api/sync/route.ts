import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST(): Promise<Response> {
  const scriptPath = path.join(process.cwd(), "scripts", "sync_publications.py");

  return new Promise<Response>((resolve) => {
    exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("Erro na sincronização:", stderr);
        resolve(
          NextResponse.json(
            { success: false, error: stderr || error.message },
            { status: 500 }
          )
        );
      } else {
        console.log("Resultado da sincronização:", stdout);
        resolve(
          NextResponse.json({
            success: true,
            message: "Publicações sincronizadas com sucesso!",
            output: stdout,
          })
        );
      }
    });
  });
}
