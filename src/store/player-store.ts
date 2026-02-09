import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// Definir tipos para el estado del reproductor
interface PlayerState {
  currentTrack: string | null;
  currentTrackTitle: string | null;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  seekTime: number | null; // Tiempo objetivo para buscar (observado por AudioPlayer)
  playbackRate: number; // Velocidad de reproducción
  playlist: string[]; // Lista de reproducción
  currentTrackIndex: number; // Índice de la pista actual en la lista
  repeatMode: "off" | "track" | "playlist"; // Modo de repetición
  shuffle: boolean; // Modo aleatorio activado
  _intervalId: ReturnType<typeof setInterval> | null;

  // Acciones de control
  play: (trackUrl?: string, title?: string) => void;
  pause: () => void;
  togglePlayPause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;

  // Acciones de posición y tiempo
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  seekTo: (time: number) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;

  // Acciones de volumen y velocidad
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;

  // Acciones de lista de reproducción
  setPlaylist: (tracks: string[]) => void;
  addToPlaylist: (track: string) => void;
  removeFromPlaylist: (index: number) => void;

  // Acciones de configuración
  setRepeatMode: (mode: "off" | "track" | "playlist") => void;
  toggleShuffle: () => void;

  // Acciones auxiliares
  setBuffering: (buffering: boolean) => void;
  clearSeek: () => void;
  reset: () => void;
  _startProgressTimer: () => void;
  _stopProgressTimer: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  subscribeWithSelector((set, get) => ({
    // Estado inicial
    currentTrack: null,
    currentTrackTitle: null,
    isPlaying: false,
    isBuffering: false,
    currentTime: 0,
    duration: 180, // Duración predeterminada de 3 minutos para fines de demostración
    volume: 1,
    seekTime: null, // Tiempo objetivo para buscar (observado por AudioPlayer)
    playbackRate: 1, // Velocidad de reproducción normal
    playlist: [],
    currentTrackIndex: -1,
    repeatMode: "off",
    shuffle: false,
    _intervalId: null,

    // Métodos privados
    _startProgressTimer: () => {
      const { _intervalId } = get();
      // Limpiar cualquier intervalo existente
      if (_intervalId) {
        clearInterval(_intervalId);
      }

      // Iniciar un nuevo intervalo que actualiza currentTime cada 100ms
      const newIntervalId = setInterval(() => {
        const { isPlaying, isBuffering, currentTime, duration } = get();
        if (isBuffering) return; // Wait until audio actually starts playing
        if (isPlaying && currentTime < duration) {
          set({ currentTime: currentTime + 0.1 });
        } else if (currentTime >= duration) {
          // La pista terminó - manejar según el modo de repetición
          const { repeatMode, playlist, currentTrackIndex } = get();

          if (repeatMode === "track") {
            // Repetir la pista actual
            set({ currentTime: 0 });
          } else if (
            repeatMode === "playlist" ||
            currentTrackIndex < playlist.length - 1
          ) {
            // Ir a la siguiente pista si hay repetición de lista o más pistas
            get().next();
          } else {
            // Detener la reproducción si no hay más pistas y no está en modo repetición
            get()._stopProgressTimer();
            set({ isPlaying: false });
          }
        }
      }, 100);

      set({ _intervalId: newIntervalId });
    },

    _stopProgressTimer: () => {
      const { _intervalId } = get();
      if (_intervalId) {
        clearInterval(_intervalId);
        set({ _intervalId: null });
      }
    },

    // Acciones de control
    play: (trackUrl, title) => {
      const {
        currentTrack,
        _stopProgressTimer,
        _startProgressTimer,
        playlist,
        currentTrackIndex,
      } = get();

      // Detener cualquier temporizador existente
      _stopProgressTimer();

      // Si se proporciona una URL específica, reproducirla
      if (trackUrl) {
        const isNewTrack = trackUrl !== currentTrack;
        set({
          currentTrack: trackUrl,
          currentTrackTitle: title ?? get().currentTrackTitle,
          isPlaying: true,
          isBuffering: isNewTrack,
          currentTime: isNewTrack ? 0 : get().currentTime,
        });
      } else {
        // Si no se proporciona URL, continuar con la pista actual
        if (currentTrack) {
          set({ isPlaying: true, isBuffering: false });
        } else if (playlist.length > 0 && currentTrackIndex >= 0) {
          set({
            currentTrack: playlist[currentTrackIndex],
            isPlaying: true,
            isBuffering: true,
            currentTime: 0,
          });
        }
      }

      // Iniciar el temporizador de progreso
      _startProgressTimer();
    },

    pause: () => {
      get()._stopProgressTimer();
      set({ isPlaying: false });
    },

    togglePlayPause: () => {
      const { isPlaying } = get();
      if (isPlaying) {
        get().pause();
      } else {
        get().play();
      }
    },

    stop: () => {
      get()._stopProgressTimer();
      set({ isPlaying: false, currentTime: 0 });
    },

    next: () => {
      const { playlist, currentTrackIndex, shuffle } = get();

      if (playlist.length === 0) return;

      let nextIndex;

      if (shuffle) {
        // Seleccionar aleatoriamente una pista que no sea la actual
        const otherTracks = playlist
          .map((_, idx) => idx)
          .filter((idx) => idx !== currentTrackIndex);

        if (otherTracks.length > 0) {
          const randomIndex = Math.floor(Math.random() * otherTracks.length);
          nextIndex = otherTracks[randomIndex];
        } else {
          return; // No hay otras pistas para reproducir
        }
      } else {
        // Pista siguiente en orden
        nextIndex = (currentTrackIndex + 1) % playlist.length;
      }

      set({ currentTrackIndex: nextIndex });
      get().play(playlist[nextIndex]);
    },

    previous: () => {
      const { playlist, currentTrackIndex, currentTime, shuffle } = get();

      if (playlist.length === 0) return;

      // Si la pista actual ha sonado por más de 3 segundos, reiniciarla
      if (currentTime > 3) {
        get().play();
        return;
      }

      let prevIndex;

      if (shuffle) {
        // Seleccionar aleatoriamente una pista que no sea la actual
        const otherTracks = playlist
          .map((_, idx) => idx)
          .filter((idx) => idx !== currentTrackIndex);

        if (otherTracks.length > 0) {
          const randomIndex = Math.floor(Math.random() * otherTracks.length);
          prevIndex = otherTracks[randomIndex];
        } else {
          return; // No hay otras pistas para reproducir
        }
      } else {
        // Pista anterior en orden
        prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      }

      set({ currentTrackIndex: prevIndex });
      get().play(playlist[prevIndex]);
    },

    // Acciones de posición y tiempo
    setCurrentTime: (time) => set({ currentTime: time }),

    setDuration: (duration) => set({ duration }),

    seekTo: (time) => set({ seekTime: time, currentTime: time }),

    skipForward: (seconds = 10) => {
      const { currentTime, duration } = get();
      const newTime = Math.min(currentTime + seconds, duration);
      get().seekTo(newTime);
    },

    skipBackward: (seconds = 10) => {
      const { currentTime } = get();
      const newTime = Math.max(currentTime - seconds, 0);
      get().seekTo(newTime);
    },

    // Acciones de volumen y velocidad
    setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }), // Limitar entre 0 y 1

    toggleMute: () => {
      const { volume } = get();
      set({ volume: volume > 0 ? 0 : 0.7 }); // Si está silenciado, establecer volumen medio
    },

    setPlaybackRate: (rate) =>
      set({ playbackRate: Math.max(0.5, Math.min(2, rate)) }), // Limitar entre 0.5x y 2x

    // Acciones de lista de reproducción
    setPlaylist: (tracks) => {
      set({ playlist: tracks });
      if (tracks.length > 0) {
        set({ currentTrackIndex: 0, currentTrack: tracks[0] });
      }
    },

    addToPlaylist: (track) => {
      const { playlist, currentTrackIndex } = get();
      const newPlaylist = [...playlist, track];
      set({ playlist: newPlaylist });
      // Si era la primera pista, establecerla como actual
      if (playlist.length === 0) {
        set({ currentTrackIndex: 0, currentTrack: track });
      }
    },

    removeFromPlaylist: (index) => {
      const { playlist, currentTrackIndex } = get();
      const newPlaylist = playlist.filter((_, i) => i !== index);
      set({ playlist: newPlaylist });

      // Ajustar el índice actual si es necesario
      if (currentTrackIndex >= index) {
        const newIndex = Math.max(0, currentTrackIndex - 1);
        set({ currentTrackIndex: newIndex });
        if (newPlaylist.length > 0) {
          set({ currentTrack: newPlaylist[newIndex] });
        }
      }
    },

    // Acciones de configuración
    setRepeatMode: (mode) => set({ repeatMode: mode }),

    toggleShuffle: () => {
      const { shuffle } = get();
      set({ shuffle: !shuffle });
    },

    // Acciones auxiliares
    setBuffering: (buffering) => set({ isBuffering: buffering }),
    clearSeek: () => set({ seekTime: null }),

    reset: () => {
      get()._stopProgressTimer();
      set({
        currentTrack: null,
        currentTrackTitle: null,
        isPlaying: false,
        isBuffering: false,
        currentTime: 0,
        duration: 180,
        seekTime: null,
        playlist: [],
        currentTrackIndex: -1,
      });
    },
  })),
);
