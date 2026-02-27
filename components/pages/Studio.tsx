"use client";

import { QuizGenerationDialog } from "@/components/pages/QuizGenerationDialog";
import { VideoRenderDialog } from "@/components/pages/VideoRenderDialog";
import {
  publicationFormSchema,
  type PublicationFormValues,
} from "@/components/pages/schemas/publication.schema";
import {
  quizConfigFormSchema,
  type QuizConfigFormValues,
} from "@/components/pages/schemas/quiz-config.schema";
import { RemotionPreview } from "@/components/remotion/RemotionPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useIntegrationsService } from "@/services/integrationsService";
import { useQuizzesService } from "@/services/quizzesService";
import { useVideosService } from "@/services/videosService";
import type { GenerateQuizOutput, QuizOutput } from "@/types/quizzes";
import { sanitizeHashtags } from "@/utils/sanitize-hashtags";
import { toHashtagsArray } from "@/utils/to-hashtags-array";
import { zodResolver } from "@hookform/resolvers/zod";
import { Film, Play, Save, Settings2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const CATEGORY_OPTIONS = [
  { id: "1", label: "Film & Animation" },
  { id: "2", label: "Autos & Vehicles" },
  { id: "10", label: "Music" },
  { id: "15", label: "Pets & Animals" },
  { id: "17", label: "Sports" },
  { id: "18", label: "Short Movies" },
  { id: "19", label: "Travel & Events" },
  { id: "20", label: "Gaming" },
  { id: "21", label: "Videoblogging" },
  { id: "22", label: "People & Blogs" },
  { id: "23", label: "Comedy" },
  { id: "24", label: "Entertainment" },
  { id: "25", label: "News & Politics" },
  { id: "26", label: "Howto & Style" },
  { id: "27", label: "Education" },
  { id: "28", label: "Science & Technology" },
  { id: "29", label: "Nonprofits & Activism" },
] as const;

export default function Studio() {
  const { toast } = useToast();
  useIntegrationsService();
  const { getLatestQuiz, generateQuiz } = useQuizzesService();
  const { renderVideo, updateVideo } = useVideosService();
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const quizConfigForm = useForm<QuizConfigFormValues>({
    resolver: zodResolver(quizConfigFormSchema),
    defaultValues: {
      niche: "",
      reference: "",
      questionsCount: 5,
    },
  });

  const publicationForm = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationFormSchema),
    defaultValues: {
      title: "",
      hashtags: "#quiz #foryou",
      category: "",
      description: "",
    },
    values: {
      title: quiz?.title ?? "",
      hashtags: quiz?.hashtags ?? "#quiz #foryou",
      category: quiz?.category ?? "",
      description: quiz?.description ?? "",
    },
  });

  const watchedTitle = publicationForm.watch("title") ?? "";
  const watchedNiche = quizConfigForm.watch("niche") ?? "";
  const watchedReference = quizConfigForm.watch("reference") ?? "";
  const hashtagsField = publicationForm.register("hashtags");
  const isPublicationDirty = publicationForm.formState.isDirty;

  const [isGenerated, setIsGenerated] = useState(false);

  const [videoPath, setVideoPath] = useState("");
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (!getLatestQuiz.data) {
      return;
    }

    const latestQuiz: QuizOutput = getLatestQuiz.data;
    const latestVideo = latestQuiz.videos[0];

    if (!latestVideo?.id) {
      setCurrentVideoId(null);
      setIsGenerated(false);
      return;
    }

    setCurrentVideoId(latestVideo.id);

    setQuiz({
      title: latestVideo?.title ?? "Quiz",
      hashtags: latestVideo?.hashtags?.join(" ") ?? "#quiz #foryou",
      category: latestVideo?.category ?? "",
      description: latestVideo?.description ?? "",
      quizId: latestQuiz.id,
      videoId: latestVideo.id,
      questions: latestQuiz.questions.map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
        })),
        answer: {
          correctAnswerIndex: question.correctAnswerIndex,
        },
        questionPath: question.questionPath!,
        answerCorrectPath: question.answerCorrectPath!,
      })),
    });
    setIsGenerated(true);
  }, [getLatestQuiz.data]);

  const previewProps = useMemo(() => {
    if (!isGenerated || !quiz) {
      return null;
    }

    return {
      title: watchedTitle.trim(),
      questions: quiz.questions,
    };
  }, [isGenerated, quiz, watchedTitle]);

  const handleGenerate = quizConfigForm.handleSubmit(async (values) => {
    try {
      const res = await generateQuiz.mutateAsync({
        niche: values.niche,
        reference: values.reference,
        questionsCount: values.questionsCount,
      });

      setQuiz(res);
      setCurrentVideoId(res.videoId ?? null);
      setVideoPath("");
      setIsGenerated(true);

      toast({
        title: "Conteúdo gerado",
        description: "Título, hashtags e descrição preenchidos.",
      });
    } catch {
      toast({
        title: "Erro ao gerar conteúdo",
        description: "Não foi possível gerar o conteúdo do quiz.",
        variant: "destructive",
      });
    }
  });

  const handleSaveChanges = async () => {
    if (!currentVideoId || !quiz?.quizId) {
      toast({
        title: "Vídeo não encontrado",
        description: "Não foi possível identificar o vídeo para atualizar.",
        variant: "destructive",
      });
      return;
    }

    const isValid = await publicationForm.trigger();
    if (!isValid) {
      toast({
        title: "Ajuste os dados",
        description: "Corrija os campos antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    const values = publicationForm.getValues();
    const normalized = {
      title: values.title.trim(),
      hashtags: sanitizeHashtags(values.hashtags),
      category: values.category.trim(),
      description: values.description.trim(),
    };

    try {
      await updateVideo.mutateAsync({
        videoId: currentVideoId,
        title: normalized.title,
        hashtags: toHashtagsArray(normalized.hashtags),
        category: normalized.category,
        description: normalized.description,
        quizId: quiz.quizId,
      });

      setQuiz((previous) =>
        previous
          ? {
            ...previous,
            title: normalized.title,
            hashtags: normalized.hashtags,
            category: normalized.category,
            description: normalized.description,
          }
          : previous,
      );

      publicationForm.reset(normalized);

      toast({
        title: "Alterações salvas",
        description: "As informações do vídeo foram atualizadas.",
      });
    } catch {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar os dados do vídeo.",
        variant: "destructive",
      });
    }
  };

  const handlePreRender = async () => {
    if (isRendering || renderVideo.isPending) {
      return;
    }

    if (!previewProps) {
      toast({
        title: "Gere o conteúdo primeiro",
        description: "Você precisa gerar o quiz antes de pré-renderizar.",
        variant: "destructive",
      });
      return;
    }

    if (!currentVideoId) {
      toast({
        title: "Vídeo não encontrado",
        description: "Gere o quiz novamente para obter o videoId.",
        variant: "destructive",
      });
      return;
    }

    setIsRendering(true);

    try {
      const { video } = await renderVideo.mutateAsync({
        videoId: currentVideoId,
        questions: previewProps.questions,
      });

      if (video?.url) {
        setVideoPath(video.url);
      }

      toast({
        title: "Vídeo pronto",
        description: "Pré-renderização concluída.",
      });
    } catch {
      toast({
        title: "Erro ao pre-renderizar",
        description: "Não foi possível renderizar o vídeo.",
        variant: "destructive",
      });
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Estúdio</h1>
        <p className="text-sm text-muted-foreground">
          Configure o quiz, gere conteúdo e renderize o vídeo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="card-blur">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings2 className="size-4 text-primary" />
                Configuração do Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nicho</Label>
                    <Input
                      {...quizConfigForm.register("niche")}
                      placeholder="Ex: anime, geografia"
                      className="h-8 text-sm"
                    />
                    {quizConfigForm.formState.errors.niche && (
                      <p className="text-xs text-destructive">
                        {quizConfigForm.formState.errors.niche.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Referência</Label>
                    <Input
                      {...quizConfigForm.register("reference")}
                      placeholder="Ex: naruto, capitais"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Qtd. perguntas</Label>
                    <Input
                      type="number"
                      min={4}
                      max={10}
                      {...quizConfigForm.register("questionsCount")}
                      className="h-8 text-sm"
                    />
                    {quizConfigForm.formState.errors.questionsCount && (
                      <p className="text-xs text-destructive">
                        {quizConfigForm.formState.errors.questionsCount.message}
                      </p>
                    )}
                  </div>
                </div>
                <Button type="submit" size="sm" disabled={generateQuiz.isPending}>
                  <Sparkles className="mr-1.5 size-3.5" />
                  {generateQuiz.isPending ? "Gerando..." : "Gerar conteúdo"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="card-blur">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Play className="size-4 text-primary" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative mx-auto w-full max-w-60 overflow-hidden rounded-lg border border-border bg-secondary/50">
                {videoPath ? (
                  <video controls src={videoPath} className="aspect-9/16 w-full object-cover" />
                ) : previewProps ? (
                  <div className="aspect-9/16 w-full">
                    <RemotionPreview inputProps={previewProps} />
                  </div>
                ) : (
                  <div className="flex aspect-9/16 w-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
                    O preview vai aparecer depois que você gerar o primeiro quiz.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="card-blur">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Film className="size-4 text-primary" />
              Configuração do Vídeo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            <form className="space-y-3" onSubmit={(event) => event.preventDefault()}>
              <div className="space-y-1.5">
                <Label className="text-xs">Título</Label>
                <Input
                  {...publicationForm.register("title")}
                  disabled={!isGenerated}
                  placeholder="Gerado automaticamente"
                  className="h-8 text-sm"
                />
                {publicationForm.formState.errors.title && (
                  <p className="text-xs text-destructive">
                    {publicationForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Hashtags</Label>
                <Input
                  {...hashtagsField}
                  onBlur={(event) => {
                    hashtagsField.onBlur(event);
                    publicationForm.setValue(
                      "hashtags",
                      sanitizeHashtags(event.target.value),
                      { shouldValidate: true },
                    );
                  }}
                  disabled={!isGenerated}
                  placeholder="#quiz #foryou"
                  className="h-8 text-sm"
                />
                {publicationForm.formState.errors.hashtags && (
                  <p className="text-xs text-destructive">
                    {publicationForm.formState.errors.hashtags.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Categoria</Label>
                <Controller
                  control={publicationForm.control}
                  name="category"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!isGenerated}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.id} - {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {publicationForm.formState.errors.category && (
                  <p className="text-xs text-destructive">
                    {publicationForm.formState.errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Descrição</Label>
                <Textarea
                  {...publicationForm.register("description")}
                  disabled={!isGenerated}
                  rows={3}
                  placeholder="Gerado automaticamente"
                  className="text-sm"
                />
                {publicationForm.formState.errors.description && (
                  <p className="text-xs text-destructive">
                    {publicationForm.formState.errors.description.message}
                  </p>
                )}
              </div>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="sm"
                onClick={handleSaveChanges}
                disabled={
                  !isGenerated ||
                  !currentVideoId ||
                  !isPublicationDirty ||
                  updateVideo.isPending
                }
              >
                <Save className="mr-1.5 size-3.5" />
                {updateVideo.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="hover:bg-background hover:text-foreground hover:brightness-110"
                onClick={handlePreRender}
                disabled={!isGenerated || renderVideo.isPending}
              >
                <Film className="mr-1.5 size-3.5" />
                {renderVideo.isPending ? "Renderizando..." : "Renderizar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <VideoRenderDialog open={isRendering} />

      <QuizGenerationDialog
        open={generateQuiz.isPending}
        niche={watchedNiche.trim()}
        reference={watchedReference.trim()}
      />
    </div>
  );
}
