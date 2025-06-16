import { Project } from "@/types/project.types";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

// GET handler to fetch all projects
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src/data/projects.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const projects = JSON.parse(fileData);

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error reading projects data:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST handler to add or update a project
export async function POST(request: Request) {
  try {
    const project = await request.json();
    const filePath = path.join(process.cwd(), "src/data/projects.json");

    // Read existing projects
    const fileData = fs.readFileSync(filePath, "utf8");
    const projects = JSON.parse(fileData);

    // Check if project already exists (update) or is new (add)
    const existingIndex = projects.findIndex((p: Project) => p.id === project.id);

    if (existingIndex >= 0) {
      // Update existing project
      projects[existingIndex] = project;
    } else {
      // Add new project with generated ID if not provided
      if (!project.id) {
        project.id = `project-${Date.now()}`;
      }
      projects.push(project);
    }

    // Write updated projects back to file
    fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), "utf8");

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE handler to remove a project
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "src/data/projects.json");

    // Read existing projects
    const fileData = fs.readFileSync(filePath, "utf8");
    let projects = JSON.parse(fileData);

    // Filter out the project to delete
    projects = projects.filter((p: Project) => p.id !== id);

    // Write updated projects back to file
    fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
