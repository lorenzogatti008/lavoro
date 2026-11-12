// ============================================================
//  GESTORE DELLA PARTITA (GameManager)
//  Regola la partita: HUD, obiettivi, messaggi, pausa, vittoria e sconfitta.
//
//  DOVE SI METTE
//    Trascina il prefab PF_Kit_GameManager nella scena. UNO SOLO per scena.
//
//  COSA CONFIGURARE (nell'Inspector)
//    Win When Objectives Complete: si vince appena gli obiettivi sono completi, senza WinZone.
//    Final Hint: la riga in fondo all'elenco (es. "Raggiungi la statua").
//    Counter Objective e Counter Label: un contatore in alto a sinistra (es. reliquie).
//    Time Limit: secondi a disposizione (0 = nessun limite).
//    Il resto (HUD, Input) e' gia' collegato nel prefab: non toccarlo.
//
//  COME SI COLLEGA
//    On Win / On Lose: cosa succede quando si vince o si perde.
//    Trova da solo tutti gli Objective della scena.
//
//  ESEMPIO
//    Metti il prefab, aggiungi i PF_Kit_Obiettivo, e premi Play: l'elenco compare da solo.
// ============================================================
using System.Linq;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.Events;
using UnityEngine.InputSystem;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

/// <summary>
/// Stato della partita e HUD. Trova da solo tutti gli Objective della scena, li mostra
/// nell'elenco e fa vincere quando quelli obbligatori sono completi (raggiungendo una
/// WinZone, oppure subito se "Win When Objectives Complete" e' attivo).
/// Gestisce anche pausa (Esc / Start), timer facoltativo, sconfitta, inventario e scheda storica a schermo.
/// Ce ne deve essere uno solo per scena: usa il prefab PF_Kit_GameManager.
/// </summary>
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    [Header("Vittoria")]
    [Tooltip("Vinci appena gli obiettivi obbligatori sono completi, senza bisogno di una WinZone")] public bool winWhenObjectivesComplete;
    [Tooltip("Riga mostrata in fondo all'elenco finche' non si vince (es. \"Raggiungi la statua\")")] public string finalHint = "";
    [Tooltip("Messaggio se il giocatore entra nella WinZone troppo presto")] public string notReadyMessage = "Completa prima tutti gli obiettivi";
    [Tooltip("Suono quando si vince")] public AudioClip winClip;
    [Tooltip("Cosa succede quando si vince")] public UnityEvent onWin = new UnityEvent();

    [Header("Contatore in alto a sinistra (facoltativo)")]
    [Tooltip("Obiettivo da mostrare come contatore, es. le reliquie. Vuoto = pannello nascosto")] public Objective counterObjective;
    [Tooltip("Il nome del contatore (es. Reliquie)")] public string counterLabel = "Reliquie";

    [Header("Tempo e sconfitta (facoltativi)")]
    [Tooltip("Secondi a disposizione; 0 = nessun limite. Allo scadere si perde")] [Min(0)] public float timeLimit;
    [Tooltip("Suono quando si perde")] public AudioClip loseClip;
    [Tooltip("Cosa succede quando si perde")] public UnityEvent onLose = new UnityEvent();

    [Header("Messaggi")]
    [Tooltip("Per quanti secondi resta a schermo un messaggio")] public float messageDuration = 3f;

    [Header("Ripartenza")]
    [Tooltip("Messaggio quando una trappola ti riporta all'ultimo punto di ripartenza")] public string respawnMessage = "Trappola! Torni all'ultimo punto di ripartenza";

    [Header("Input (gia' collegato nel prefab)")]
    [Tooltip("Asset delle Input Actions del kit (Settings/Kit_InputActions)")] public InputActionAsset actions;

    [Header("HUD (gia' collegato nel prefab)")]
    public Text objectiveText;
    public Text promptText, counterText, messageText;
    public GameObject promptRoot, counterRoot, messageRoot, winBanner, crosshair;
    public GameObject pauseScreen, loseScreen;
    public Text timerText;
    [Tooltip("Pannello del timer: nascosto se non c'e' un limite di tempo")] public GameObject timerRoot;
    [Tooltip("Testo del bottone che cambia qualita' nel menu pausa")] public Text qualityLabel;
    [Tooltip("Caselle dell'inventario (icone), da sinistra")] public Image[] inventorySlots = new Image[0];
    [Tooltip("Pannello della scheda storica")] public GameObject cardRoot;
    public Text cardTitle, cardText, cardSource;
    public Image cardImage;

    Objective[] objectives = new Objective[0];
    bool won, lost, paused; float messageUntil = -1f, timeLeft, timeScaleBeforePause = 1f;
    InputAction pauseAction, cancelAction; InputActionMap playerMap, uiMap;

    public bool Won => won;
    public bool Lost => lost;
    public bool IsPaused => paused;
    public float TimeLeft => timeLimit > 0 ? Mathf.Max(0, timeLeft) : 0f;
    public Objective[] Objectives => objectives;
    /// <summary>Dove riparte il giocatore: la partenza, poi l'ultimo CheckpointZone raggiunto.</summary>
    public Vector3 RespawnPoint => respawnPoint;
    Vector3 respawnPoint; Quaternion respawnRotation = Quaternion.identity;
    public bool AllRequiredComplete => objectives.All(o => o.optional || o.IsComplete);

    void Awake()
    {
        if (Instance && Instance != this) Debug.LogWarning("Ci sono due GameManager nella scena: ne serve uno solo.", this);
        Instance = this;
        if (actions)
        {
            playerMap = actions.FindActionMap("Player"); uiMap = actions.FindActionMap("UI");
            pauseAction = actions.FindAction("Player/Pause"); cancelAction = actions.FindAction("UI/Cancel");
        }
    }

    void OnDestroy()
    {
        if (Instance == this) Instance = null;
        if (paused) Time.timeScale = timeScaleBeforePause;
    }

    void Start()
    {
        objectives = FindObjectsByType<Objective>().OrderBy(o => o.order).ThenBy(o => o.name).ToArray();
        timeLeft = timeLimit;
        foreach (var go in new[] { winBanner, messageRoot, pauseScreen, loseScreen, cardRoot }) if (go) go.SetActive(false);
        var player = FindAnyObjectByType<PlayerController>();
        if (player) { respawnPoint = player.transform.position; respawnRotation = player.transform.rotation; }
        if (crosshair) crosshair.SetActive(player && player.firstPerson);
        if (timerText) timerText.gameObject.SetActive(timeLimit > 0);
        if (timerRoot) timerRoot.SetActive(timeLimit > 0);
        if (Inventory.Instance) Inventory.Instance.onChanged.AddListener(RefreshInventory);
        RefreshInventory();
        SetPrompt(null);
        Refresh();
    }

    /// <summary>Aggiorna l'HUD. Gli Objective lo chiamano da soli quando cambiano.</summary>
    public void Refresh()
    {
        if (counterRoot) counterRoot.SetActive(counterObjective);
        if (counterText && counterObjective) counterText.text = $"{counterLabel}  {counterObjective.Count}/{counterObjective.requiredCount}";
        if (objectiveText)
        {
            var lines = objectives.Select(o =>
                (o.IsComplete ? "[x] " : "[ ] ") + o.description
                + (o.requiredCount > 1 ? $" ({o.Count}/{o.requiredCount})" : "")
                + (o.optional ? " (facoltativo)" : ""));
            var text = string.Join("\n", lines);
            if (!won && !string.IsNullOrEmpty(finalHint)) text += (text.Length > 0 ? "\n" : "") + "> " + finalHint;
            objectiveText.text = text;
        }
        if (winWhenObjectivesComplete && !won && objectives.Length > 0 && AllRequiredComplete) Win();
    }

    /// <summary>Vince se gli obiettivi obbligatori sono completi, altrimenti mostra un avviso. La usa la WinZone.</summary>
    public void TryWin()
    {
        if (won || lost) return;
        if (AllRequiredComplete) Win();
        else if (!string.IsNullOrEmpty(notReadyMessage)) ShowMessage(notReadyMessage);
    }

    /// <summary>Vittoria immediata, senza controllare gli obiettivi.</summary>
    public void Win()
    {
        if (won || lost) return;
        won = true;
        ShowEndScreen(winBanner);
        KitAudio.Play(winClip);
        Refresh();
        onWin.Invoke();
    }

    /// <summary>Sconfitta immediata (schermata di sconfitta). Non ha effetto dopo una vittoria.</summary>
    public void Lose()
    {
        if (won || lost) return;
        lost = true;
        ShowEndScreen(loseScreen);
        KitAudio.Play(loseClip);
        onLose.Invoke();
    }

    void ShowEndScreen(GameObject screen)
    {
        if (!screen) return;
        screen.SetActive(true);
        Cursor.lockState = CursorLockMode.None; Cursor.visible = true;
        var button = screen.GetComponentInChildren<Button>();
        if (button && EventSystem.current) EventSystem.current.SetSelectedGameObject(button.gameObject); // per il gamepad
    }

    /// <summary>Mette in pausa (schermata di pausa, tempo fermo, cursore libero).</summary>
    public void Pause()
    {
        if (paused || won || lost) return;
        paused = true;
        timeScaleBeforePause = Time.timeScale; Time.timeScale = 0f;
        if (pauseScreen) pauseScreen.SetActive(true);
        SuspendPrompt(true); if (messageRoot) messageRoot.SetActive(false);
        RefreshQualityLabel();
        playerMap?.Disable(); uiMap?.Enable();
        Cursor.lockState = CursorLockMode.None; Cursor.visible = true;
        var button = pauseScreen ? pauseScreen.GetComponentInChildren<Button>() : null;
        if (button && EventSystem.current) EventSystem.current.SetSelectedGameObject(button.gameObject);
    }

    /// <summary>Riprende dalla pausa.</summary>
    public void Resume()
    {
        if (!paused) return;
        paused = false;
        Time.timeScale = timeScaleBeforePause;
        if (pauseScreen) pauseScreen.SetActive(false);
        SuspendPrompt(false);
        playerMap?.Enable();
        Cursor.lockState = CursorLockMode.Locked; Cursor.visible = false;
    }

    /// <summary>Cambia qualita' (Bassa/Alta). La usa il bottone del menu pausa.</summary>
    public void ToggleQuality()
    {
        if (QualityManager.Instance) QualityManager.Instance.Toggle();
        RefreshQualityLabel();
    }

    void RefreshQualityLabel()
    {
        if (qualityLabel && QualityManager.Instance) qualityLabel.text = "Qualita': " + QualityManager.Instance.Current;
    }

    /// <summary>Esce dal gioco (nell'editor ferma il Play).</summary>
    public void Quit()
    {
#if UNITY_EDITOR
        UnityEditor.EditorApplication.isPlaying = false;
#else
        Application.Quit();
#endif
    }

    /// <summary>Aggiorna il punto di ripartenza (lo chiama CheckpointZone).</summary>
    public void SetCheckpoint(Transform point) { if (!point) return; respawnPoint = point.position; respawnRotation = point.rotation; }

    /// <summary>Riporta il giocatore all'ultimo punto di ripartenza con il messaggio predefinito. Si puo' chiamare da un UnityEvent.</summary>
    public void Respawn() { Respawn(respawnMessage); }

    /// <summary>Riporta il giocatore all'ultimo punto di ripartenza e mostra il messaggio (vuoto = nessuno).</summary>
    public void Respawn(string message)
    {
        var player = FindAnyObjectByType<PlayerController>();
        if (player) player.Teleport(respawnPoint, respawnRotation);
        if (!string.IsNullOrEmpty(message)) ShowMessage(message);
    }

    /// <summary>Mostra un messaggio a schermo per qualche secondo. Si puo' chiamare da un UnityEvent.</summary>
    public void ShowMessage(string text) { ShowMessage(text, messageDuration); }

    void ShowMessage(string text, float seconds)
    {
        if (messageText) messageText.text = text;
        if (messageRoot) messageRoot.SetActive(!string.IsNullOrEmpty(text));
        messageUntil = Time.unscaledTime + seconds;
    }

    public void SetPrompt(string t)
    {
        promptVisible = !string.IsNullOrEmpty(t);
        if (promptRoot) promptRoot.SetActive(promptVisible && !promptSuspended);
        if (promptText) promptText.text = t ?? "";
    }

    // Pausa e scheda storica coprono lo schermo: il prompt sparisce e torna quando si chiudono.
    bool promptVisible, promptSuspended;
    void SuspendPrompt(bool on) { promptSuspended = on; if (promptRoot) promptRoot.SetActive(promptVisible && !on); }

    /// <summary>Mostra la scheda storica a schermo (la chiama InfoPoint).</summary>
    public void ShowCard(string title, string text, Sprite image, string source)
    {
        if (!cardRoot) return;
        if (cardTitle) cardTitle.text = title;
        if (cardText) cardText.text = text;
        if (cardSource) cardSource.text = string.IsNullOrEmpty(source) ? "" : "Fonte: " + source;
        if (cardImage) { cardImage.sprite = image; cardImage.gameObject.SetActive(image); }
        if (cardText) LayoutCardText(image);
        cardRoot.SetActive(true);
        SuspendPrompt(true); if (messageRoot) messageRoot.SetActive(false);
    }

    /// <summary>Nasconde la scheda storica (la chiama InfoPoint).</summary>
    public void HideCard() { if (cardRoot) cardRoot.SetActive(false); SuspendPrompt(false); }

    // Con l'immagine il testo sta nella colonna di destra; senza, occupa tutta la scheda.
    void LayoutCardText(bool withImage)
    {
        var r = cardText.rectTransform;
        if (withImage) { r.anchorMin = r.anchorMax = new Vector2(1, 0.5f); r.pivot = new Vector2(1, 0.5f); r.anchoredPosition = new Vector2(-60, -10); r.sizeDelta = new Vector2(600, 420); }
        else { r.anchorMin = Vector2.zero; r.anchorMax = Vector2.one; r.pivot = new Vector2(0.5f, 0.5f); r.offsetMin = new Vector2(70, 100); r.offsetMax = new Vector2(-70, -130); }
    }

    void RefreshInventory()
    {
        var inv = Inventory.Instance;
        for (int i = 0; i < inventorySlots.Length; i++)
        {
            var slot = inventorySlots[i]; if (!slot) continue;
            var item = inv && i < inv.Items.Count ? inv.Items[i] : null;
            slot.sprite = item?.icon;
            slot.enabled = item != null;
        }
    }

    /// <summary>Ricarica la scena da capo.</summary>
    public void Restart()
    {
        Time.timeScale = 1f;
        var scene = SceneManager.GetActiveScene();
#if UNITY_EDITOR
        // Nell'editor la scena puo' non essere nelle Build Settings: la ricarico dal suo percorso.
        if (scene.buildIndex < 0) { UnityEditor.SceneManagement.EditorSceneManager.LoadSceneInPlayMode(scene.path, new LoadSceneParameters(LoadSceneMode.Single)); return; }
#endif
        SceneManager.LoadScene(scene.buildIndex);
    }

    void Update()
    {
        if (messageRoot && messageRoot.activeSelf && Time.unscaledTime > messageUntil) messageRoot.SetActive(false);

        if (pauseAction != null && pauseAction.WasPressedThisFrame())
        {
            if (InfoPoint.Current) InfoPoint.Current.Close();
            else Pause();
        }
        else if (paused && cancelAction != null && cancelAction.WasPressedThisFrame()) Resume();

        if (timeLimit > 0 && !won && !lost && !paused)
        {
            timeLeft -= Time.deltaTime;
            if (timerText) { int s = Mathf.CeilToInt(Mathf.Max(0, timeLeft)); timerText.text = $"{s / 60}:{s % 60:00}"; }
            if (timeLeft <= 0) Lose();
        }
    }
}
