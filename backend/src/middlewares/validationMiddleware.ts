import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

const answeredQuestionSchema = z.object({
  questionId: z.string(),
  selectedOption: z.string(),
});

const submitAnswerRequestSchema = z.object({
  userId: z.string(),
  currentQuestion: z.number(),
  answeredQuestion: answeredQuestionSchema,
});

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid data", details: errorMessages });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  };
}
