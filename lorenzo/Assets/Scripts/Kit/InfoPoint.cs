// ============================================================
//  SCHEDA STORICA (InfoPoint)
//  Mostra una scheda con titolo, testo, immagine e fonte. Il gioco si ferma finche' e' aperta.
//
//  DOVE SI METTE
//    Sullo stesso oggetto di un Interactable, oppure trascina PF_Kit_SchedaStorica.
//
//  COSA CONFIGURARE (nell'Inspector)
//    Title: il titolo. Text: il testo (5-8 righe si leggono bene).
//    Image: un'immagine (facoltativa, massimo 1024 px).
//    Source: la fonte del testo e dell'immagine. Scrivila sempre.
//    Objective: obiettivo da far avanzare la prima volta che viene letta (facoltativo).
//
//  COME SI COLLEGA
//    Nell'Interactable: On Interact > + > trascina questo oggetto > InfoPoint > Toggle.
//    Si apre con E, si chiude con E o Esc. On Closed: cosa succede alla chiusura.
//
//  ESEMPIO
//    Title = "Le offerte votive", Text = il testo, Source = il libro o il sito da cui viene.
// ============================================================
using UnityEngine;
using UnityEngine.Events;

/// <summary>
/// Mostra una scheda storica. Collega Interactable.onInteract -> InfoPoint.Toggle: si apre con E,
/// si chiude con E o Esc. Il gioco si ferma mentre e' aperta.
/// </summary>
public class InfoPoint : MonoBehaviour
{
    [Tooltip("Titolo della scheda")] public string title = "Titolo";
    [Tooltip("Testo della scheda")] [TextArea(5, 20)] public string text;
    [Tooltip("Immagine della scheda (facoltativa, massimo 1024 px)")] public Sprite image;
    [Tooltip("Fonte o crediti del testo e dell'immagine")] public string source;
    [Tooltip("Obiettivo da far avanzare la prima volta che la scheda viene letta (facoltativo)")] public Objective objective;
    [Tooltip("Cosa succede quando la scheda viene chiusa")] public UnityEvent onClosed = new UnityEvent();

    static InfoPoint current;
    bool open, read; float timeScaleBefore = 1f;

    /// <summary>La scheda aperta in questo momento (null se nessuna).</summary>
    public static InfoPoint Current => current;
    public bool IsOpen => open;

    public void Open()
    {
        if (open) return;
        if (current && current != this) current.Close();
        open = true; current = this;
        timeScaleBefore = Time.timeScale; Time.timeScale = 0f;
        GameManager.Instance?.ShowCard(title, text, image, source);
        if (!read) { read = true; if (objective) objective.AddProgress(); }
    }

    public void Close()
    {
        if (!open) return;
        open = false; if (current == this) current = null;
        Time.timeScale = timeScaleBefore;
        GameManager.Instance?.HideCard();
        onClosed.Invoke();
    }

    /// <summary>Apre la scheda se e' chiusa, la chiude se e' aperta. Da collegare a Interactable.onInteract.</summary>
    public void Toggle() { if (open) Close(); else Open(); }

    void OnDisable() { Close(); }
}
