import { loggerService } from "../../services/logger.service.js";
import { bugService } from "./bug.service.js";
import path from "path";
import PDFDocument from "pdfkit";
import fs from "fs";
import { authService } from "../auth/auth.service.js";

export async function getBugs(req, res) {
  const { sortBy, txt, minSeverity, label } = req.query;
  try {
    const bugs = await bugService.query({
      sortBy,
      txt,
      minSeverity: +minSeverity,
      label,
    });
    res.send(bugs);
  } catch (err) {
    loggerService.error("err:", err);
    res.status(400).send("Couldn't get bugs");
  }
}
export async function getBug(req, res) {
  const { bugId } = req.params;

  try {
    const bug = await bugService.getById(bugId);
    res.send(bug);
  } catch (err) {
    loggerService.error("err:", err);
    res.status(400).send("Couldn't get bug");
  }
}
export async function postBug(req, res) {
  const { title, severity, labels, description, ownerId } = req.body;

  if (!title || !severity || !ownerId || !description)
    return res.status(400).send("Couldn't save bug");
  const bugToSave = {
    title,
    severity: +severity,
    ownerId,
    labels,
    description,
  };
  try {
    const savedBug = await bugService.save(bugToSave);
    res.send(savedBug);
  } catch (err) {
    loggerService.error("err:", err);
    res.status(400).send("Couldn't save bug");
  }
}
export async function putBug(req, res) {
  const { title, severity, labels, description, ownerId, _id } = req.body;

  if (!title || !severity || !ownerId || !description || !_id)
    return res.status(400).send("Couldn't save bug");

  const bugToSave = {
    title,
    severity: +severity,
    ownerId,
    labels,
    description,
    _id,
  };
  try {
    const savedBug = await bugService.save(bugToSave);
    res.send(savedBug);
  } catch (err) {
    loggerService.error("err:", err);
    res.status(400).send("Couldn't save bug");
  }
}
export async function downloadBug(req, res) {
  const { bugId } = req.params;
  const filePath = path.join("./data", "bug_" + bugId + ".pdf");

  try {
    const bug = await bugService.getById(bugId);

    if (!bug) {
      return res.status(404).send("Bug not found");
    }

    // Create a PDF document
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);
    doc.fontSize(18).text("Bug Info", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Title: ${bug.title}`);
    doc.text(`Severity: ${bug.severity}`);
    doc.text(`ID: ${bug._id}`);
    doc.moveDown();

    // End the document and finalize the write stream
    doc.end();

    // Wait for the PDF to be fully written
    writeStream.on("finish", () => {
      console.log(`PDF generated at ${filePath}`);
      res.download(filePath, `bug_${bug.title}.pdf`, (err) => {
        if (err) {
          loggerService.error("Error downloading PDF:", err);
          res.status(500).send("Error downloading PDF");
        } else {
          // Successfully sent, delete the file
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              loggerService.error("Error deleting PDF:", unlinkErr);
            }
          });
        }
      });
    });

    writeStream.on("error", (err) => {
      loggerService.error("Error writing PDF file:", err);
      res.status(500).send("Error generating PDF");
    });
  } catch (err) {
    loggerService.error("err:", err);
    res.status(400).send("Couldn't generate PDF");
  }
}

export async function deleteBug(req, res) {
  const { bugId } = req.params;
  try {
    await bugService.remove(bugId);
    res.send("Bug Deleted");
  } catch (err) {
    loggerService.error("err:", err);
    res.status(400).send("Couldn't remove bug");
  }
}
export function trackVisitedBugs(req, res, next) {
  const loggedinUser = authService.validateToken(req.cookies.loginToken);

  if (loggedinUser) {
    return next();
  }

  let visitedBugs = req.cookies.visitedBugs
    ? JSON.parse(req.cookies.visitedBugs)
    : [];
  const { bugId } = req.params;

  if (!visitedBugs.includes(bugId)) {
    visitedBugs.push(bugId);
  }

  if (visitedBugs.length > 3) {
    loggerService.warn(`User visited too many bugs: ${visitedBugs}`);
    return res
      .status(429)
      .send("Too many orders per time. Please try again later.");
  }

  res.cookie("visitedBugs", JSON.stringify(visitedBugs), { maxAge: 7000 });

  next();
}
